<?php
// event_register.php - register a student for an event by calling the stored procedure
// register_for_event() with PDO prepared statements, plus CSRF protection.
session_start();
require_once __DIR__ . '/db.php';
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
$e = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$result = ''; $isOk = false; $events = []; $summary = [];

try {
    $pdo = db();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {
            http_response_code(403);
            $result = 'ERROR: invalid security token.';
        } else {
            $enrollment = trim($_POST['enrollment'] ?? '');
            $eventId    = filter_var($_POST['event_id'] ?? '', FILTER_VALIDATE_INT);
            if (!preg_match('/^[0-9]{10,12}$/', $enrollment) || $eventId === false) {
                $result = 'ERROR: enter a valid enrollment number and select an event.';
            } else {
                $st = $pdo->prepare('SELECT student_id FROM students WHERE enrollment = ?');
                $st->execute([$enrollment]);
                $sid = $st->fetchColumn();
                if ($sid === false) {
                    $result = 'ERROR: no student with that enrollment number.';
                } else {
                    $pdo->prepare('CALL register_for_event(?, ?, @status)')->execute([$sid, $eventId]);
                    $result = $pdo->query('SELECT @status')->fetchColumn();
                }
            }
            $isOk = str_starts_with($result, 'SUCCESS');
        }
    }
    $summary = $pdo->query('SELECT * FROM v_event_summary ORDER BY event_date')->fetchAll();
} catch (Throwable $ex) {
    error_log($ex->getMessage());
    $result = 'Database error. Please try again later.';
}
?>
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>StudentHub - Event Registration</title><link rel="stylesheet" href="register.css">
<style>main{max-width:900px}table{border-collapse:collapse;width:100%;font-size:13px;margin-top:10px}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}th{background:#1b2240;color:#fff}.tw{overflow-x:auto}</style></head>
<body><header><h1>StudentHub</h1><p>Register for an Event (Stored Procedure)</p></header>
<main id="main"><section>
<h2>Event Registration</h2>
<?php if ($result): ?><div class="<?= $isOk ? 'success-msg' : 'error-summary' ?>" role="alert"><?= $e($result) ?></div><?php endif; ?>
<form method="post" action="event_register.php" style="margin-top:14px">
    <input type="hidden" name="csrf_token" value="<?= $e($_SESSION['csrf_token']) ?>">
    <div class="field"><label for="enrollment">Enrollment Number</label>
        <input type="text" id="enrollment" name="enrollment" maxlength="12" placeholder="e.g. 210123456001" required></div>
    <div class="field"><label for="event_id">Event</label>
        <select id="event_id" name="event_id" required><option value="">Select event</option>
        <?php foreach ($summary as $ev): ?><option value="<?= (int)$ev['event_id'] ?>"><?= $e($ev['title']) ?> (<?= (int)$ev['seats_left'] ?> seats left)</option><?php endforeach; ?>
        </select></div>
    <input type="submit" value="Register for Event">
</form>
<h2 style="margin-top:22px">Seats per event (from view v_event_summary)</h2>
<div class="tw"><table><tr><th>Event</th><th>Date</th><th>Venue</th><th>Seats</th><th>Registered</th><th>Left</th></tr>
<?php foreach ($summary as $r): ?><tr><td><?= $e($r['title']) ?></td><td><?= $e($r['event_date']) ?></td><td><?= $e($r['venue']) ?></td><td><?= (int)$r['seats'] ?></td><td><?= (int)$r['registered'] ?></td><td><?= (int)$r['seats_left'] ?></td></tr><?php endforeach; ?>
</table></div>
</section></main></body></html>
