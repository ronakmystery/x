<?php
$dsn = 'mysql:host=mariadb;dbname=mydb';
$username = 'user';
$password = 'password';

try {
    $db = new PDO($dsn, $username, $password);
    echo "Connected to MariaDB successfully!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>
