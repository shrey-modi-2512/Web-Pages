<?php
// db.php - secure PDO connection for StudentHub.
// Usage:  require_once 'db.php';  $pdo = db();
const DB_HOST = 'localhost';
const DB_NAME = 'studenthub';
const DB_USER = 'root';      // XAMPP default. In production use a limited-privilege user.
const DB_PASS = '';          // XAMPP default is an empty password.

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,   // errors become exceptions
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,                    // real prepared statements
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('DB connection failed: ' . $e->getMessage());   // details go to the log only
            throw new RuntimeException('Database connection failed.'); // generic message for users
        }
    }
    return $pdo;
}
