<?php
// test_db.php - connection test page (take the screenshot of this page)
require_once __DIR__ . '/db.php';
$e = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$msg = ''; $counts = []; $join = [];
try {
    $pdo = db();
    $msg = 'Connected successfully. MySQL version ' . $pdo->query('SELECT VERSION()')->fetchColumn()
         . ', database "' . $pdo->query('SELECT DATABASE()')->fetchColumn() . '".';
    foreach (['departments', 'students', 'events', 'registrations'] as $t) {   // fixed whitelist, no user input
        $counts[$t] = $pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
    }
    $join = $pdo->query('SELECT s.fullname, s.enrollment, d.name AS department, e.title, r.registered_at
                         FROM registrations r
                         JOIN students s    ON s.student_id = r.student_id
                         JOIN departments d ON d.department_id = s.department_id
                         JOIN events e      ON e.event_id = r.event_id
                         ORDER BY r.registered_at, s.fullname LIMIT 10')->fetchAll();
    $ok = true;
} catch (Throwable $ex) {
    $ok = false;
    $msg = 'Connection failed. Check that MySQL is running in XAMPP and that studenthub.sql has been imported.';
}
?>
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>StudentHub - DB Connection Test</title><link rel="stylesheet" href="register.css">
<style>main{max-width:900px}table{border-collapse:collapse;width:100%;font-size:13px;margin-top:10px}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}th{background:#1b2240;color:#fff}</style></head>
<body><header><h1>StudentHub</h1><p>Database Connection Test</p></header>
<main id="main"><section>
<div class="<?= $ok ? 'success-msg' : 'error-summary' ?>" role="status"><?= $e($msg) ?></div>
<?php if ($ok): ?>
<h2 style="margin-top:16px">Row counts</h2>
<ul><?php foreach ($counts as $t => $n): ?><li><?= $e($t) ?>: <?= (int)$n ?></li><?php endforeach; ?></ul>
<h2 style="margin-top:16px">Sample JOIN (registrations)</h2>
<table><tr><th>Student</th><th>Enrollment</th><th>Department</th><th>Event</th><th>When</th></tr>
<?php foreach ($join as $r): ?><tr><td><?= $e($r['fullname']) ?></td><td><?= $e($r['enrollment']) ?></td><td><?= $e($r['department']) ?></td><td><?= $e($r['title']) ?></td><td><?= $e($r['registered_at']) ?></td></tr><?php endforeach; ?>
</table>
<p style="margin-top:14px"><a href="event_register.php">Try the stored procedure &rarr;</a></p>
<?php endif; ?>
</section></main></body></html>
