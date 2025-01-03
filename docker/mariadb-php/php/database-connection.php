<?php
// Set CORS headers
header("Access-Control-Allow-Origin: *"); // Allow all origins (adjust for production)
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type"); // Allowed headers
header("Content-Type: application/json"); // Return JSON response
function getDatabaseConnection() {
    
    $host = 'mariadb';
    $username = 'user';
    $password = 'password';
    $dbname = 'mydb';

    $conn = new mysqli($host, $username, $password, $dbname);

    if ($conn->connect_error) {
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }

    return $conn;
}
