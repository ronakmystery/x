<?php
require_once "./database-connection.php";

// Establish a connection to MariaDB
$conn = getDatabaseConnection();


// Get the input data
$data = json_decode(file_get_contents('php://input'), true);


// echo json_encode([
//     'status' => 'success',
//     'received' => $data,
// ]);

// Validate the input
if (!isset($data['username']) || !isset($data['email'])) {
    echo json_encode(["error" => "Invalid input. Name and email are required."]);
    exit;
}

$name = $data['username'];
$email = $data['email'];

// Prepare the SQL query to insert the user
$stmt = $conn->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);

if ($stmt->execute()) {
    // Success
    echo json_encode(["message" => "User created successfully."]);
} else {
    // Error
    echo json_encode(["error" => "Failed to create user: " . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();

?>

