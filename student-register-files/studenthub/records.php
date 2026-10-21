<?php
// records.php - displays stored registrations (password hashes are never shown)
$file = __DIR__ . '/storage/registrations.json';
$rows = is_file($file) ? (json_decode(file_get_contents($file), true) ?: []) : [];
$e = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Stored Records</title>
    <link rel="stylesheet" href="register.css">
    <style>main{max-width:1000px} table{border-collapse:collapse;width:100%;font-size:13px} th,td{border:1px solid #ddd;padding:6px 8px;text-align:left} th{background:#1b2240;color:#fff} .tw{overflow-x:auto}</style>
</head>
<body>
    <header><h1>StudentHub</h1><p>Stored Registrations</p></header>
    <main id="main"><section>
        <h2>Records (<?= count($rows) ?>)</h2>
        <?php if (!$rows): ?>
            <p>No registrations stored yet.</p>
        <?php else: ?>
            <div class="tw"><table>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Mobile</th><th>Enrollment</th><th>Course</th><th>Year</th><th>Sem</th><th>Gender</th><th>Registered</th></tr>
                <?php foreach ($rows as $i => $r): ?>
                <tr><td><?= $i + 1 ?></td><td><?= $e($r['fullname']) ?></td><td><?= $e($r['email']) ?></td><td><?= $e($r['phone']) ?></td>
                    <td><?= $e($r['enrollment']) ?></td><td><?= $e($r['department']) ?></td><td><?= $e($r['year']) ?></td>
                    <td><?= $e($r['semester']) ?></td><td><?= $e($r['gender']) ?></td><td><?= $e($r['registered_at']) ?></td></tr>
                <?php endforeach; ?>
            </table></div>
        <?php endif; ?>
        <p style="margin-top:14px"><a href="register.html">&larr; Register another student</a></p>
    </section></main>
</body>
</html>
