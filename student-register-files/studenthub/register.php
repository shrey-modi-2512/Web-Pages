<?php

session_start();

function clean(string $v): string {                    // sanitize: trim, strip tags, collapse spaces
    return preg_replace('/\s+/', ' ', trim(strip_tags($v)));
}

$errors = [];
$ok = false;
$dbMsg = '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {           // Q1: is the form submitted using POST?
    http_response_code(405);
    $errors[] = 'This page accepts POST requests only. Please use the registration form.';
} else {
    $token = $_POST['csrf_token'] ?? '';
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        $errors[] = 'Invalid or missing security token. Reload the form and try again.';
    } else {
        $in = [
            'fullname'   => clean($_POST['fullname'] ?? ''),
            'email'      => clean($_POST['email'] ?? ''),
            'phone'      => clean($_POST['phone'] ?? ''),
            'enrollment' => clean($_POST['enrollment'] ?? ''),
            'department' => clean($_POST['department'] ?? ''),
            'year'       => clean($_POST['year'] ?? ''),
            'semester'   => clean($_POST['semester'] ?? ''),
            'gender'     => clean($_POST['gender'] ?? ''),
        ];
        $password = $_POST['password'] ?? '';
        $confirm  = $_POST['confirm'] ?? '';

        
        if (!preg_match("/^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/", $in['fullname']) || strlen($in['fullname']) < 2 || strlen($in['fullname']) > 50)
            $errors[] = 'Full name must be 2-50 letters/spaces.';
        if (!filter_var($in['email'], FILTER_VALIDATE_EMAIL))
            $errors[] = 'Enter a valid email address.';
        if (!preg_match('/^[6-9][0-9]{9}$/', $in['phone']))
            $errors[] = 'Mobile number must be 10 digits starting with 6-9.';
        if (!preg_match('/^[0-9]{10,12}$/', $in['enrollment']))
            $errors[] = 'Enrollment number must be 10-12 digits.';
        if (!in_array($in['department'], ['Computer Engineering','Information Technology','Mechanical Engineering','Civil Engineering','Electrical Engineering'], true))
            $errors[] = 'Select a valid course.';
        if (!in_array($in['year'], ['First Year','Second Year','Third Year','Fourth Year'], true))
            $errors[] = 'Select a valid year.';
        if (!preg_match('/^Semester [1-8]$/', $in['semester']))
            $errors[] = 'Select a valid semester.';
        if (!in_array($in['gender'], ['Male','Female','Other'], true))
            $errors[] = 'Select a valid gender.';
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/', $password))
            $errors[] = 'Password needs 8+ characters with upper, lower, number and special character.';
        if ($password !== $confirm)
            $errors[] = 'Passwords do not match.';
        if (empty($_POST['terms']))
            $errors[] = 'You must accept the Terms and Conditions.';

        if (!$errors) {
            $dir  = __DIR__ . '/storage';
            $json = $dir . '/registrations.json';
            $csv  = $dir . '/registrations.csv';
            if (!is_dir($dir) && !mkdir($dir, 0755, true)) $errors[] = 'Storage folder could not be created.';

            if (!$errors) {
                $record = $in + [
                    'password_hash' => password_hash($password, PASSWORD_DEFAULT),   // never store plain passwords
                    'registered_at' => date('Y-m-d H:i:s'),
                ];
                $fp = fopen($json, 'c+');                       // create if missing, no truncate
                if ($fp && flock($fp, LOCK_EX)) {               // exclusive lock avoids concurrent-write corruption
                    $existing = json_decode(stream_get_contents($fp), true) ?: [];
                    $dup = array_filter($existing, fn($r) => strcasecmp($r['email'], $in['email']) === 0 || $r['enrollment'] === $in['enrollment']);
                    if ($dup) {
                        $errors[] = 'This email or enrollment number is already registered.';
                    } else {
                        $existing[] = $record;
                        ftruncate($fp, 0); rewind($fp);
                        fwrite($fp, json_encode($existing, JSON_PRETTY_PRINT));
                        // CSV copy (header written when file is new)
                        $new = !file_exists($csv);
                        $c = fopen($csv, 'a');
                        if ($new) fputcsv($c, array_keys($record));
                        fputcsv($c, array_values($record));
                        fclose($c);
                        $ok = true;
                        // ---- Practical 8: also save in MySQL (PDO prepared statement) ----
                        try {
                            require_once __DIR__ . '/db.php';
                            $yearMap = ['First Year' => 1, 'Second Year' => 2, 'Third Year' => 3, 'Fourth Year' => 4];
                            $ins = db()->prepare('INSERT INTO students (fullname, email, phone, enrollment, department_id, year_of_study, semester, gender, password_hash)
                                VALUES (:fullname, :email, :phone, :enrollment, (SELECT department_id FROM departments WHERE name = :dept), :yr, :sem, :gender, :hash)');
                            $ins->execute([':fullname' => $in['fullname'], ':email' => $in['email'], ':phone' => $in['phone'],
                                ':enrollment' => $in['enrollment'], ':dept' => $in['department'], ':yr' => $yearMap[$in['year']],
                                ':sem' => (int) substr($in['semester'], 9), ':gender' => $in['gender'], ':hash' => $record['password_hash']]);
                            $dbMsg = 'Also saved in the MySQL database.';
                        } catch (Throwable $ex) {
                            error_log('DB insert failed: ' . $ex->getMessage());
                            $dbMsg = 'Saved to files; the database copy could not be stored.';
                        }
                        unset($_SESSION['csrf_token']);         // one-time token
                    }
                    fflush($fp); flock($fp, LOCK_UN);
                } else {
                    $errors[] = 'Could not write to the storage file.';
                }
                if ($fp) fclose($fp);
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Registration Result</title>
    <link rel="stylesheet" href="register.css">
</head>
<body>
    <header><h1>StudentHub</h1><p>Registration Result</p></header>
    <main id="main"><section>
        <?php if ($ok): ?>
            <h2>Registration successful</h2>
            <div class="success-msg" role="status">Thank you, <?= htmlspecialchars($in['fullname'], ENT_QUOTES, 'UTF-8') ?>! Your details were saved.</div>
            <?php if ($dbMsg): ?><p style="margin-top:10px"><?= htmlspecialchars($dbMsg, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
            <p style="margin-top:14px"><a href="records.php">View stored records</a> | <a href="login.html">Go to Login</a></p>
        <?php else: ?>
            <h2>Registration failed</h2>
            <div class="error-summary" role="alert"><strong>Please fix the following:</strong>
                <ul><?php foreach ($errors as $e): ?><li><?= htmlspecialchars($e, ENT_QUOTES, 'UTF-8') ?></li><?php endforeach; ?></ul>
            </div>
            <p><a href="register.html">&larr; Back to the form</a></p>
        <?php endif; ?>
    </section></main>
</body>
</html>
