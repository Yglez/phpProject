<?php
$dsn = 'mysql:host=localhost;dbname=testdatabase';
$username = 'yglez787';
$password = 'County1.';
$options = [];
try {
$connection = new PDO($dsn, $username, $password, $options);
} catch(PDOException $e) {
}