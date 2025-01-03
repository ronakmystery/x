<?php


require_once "./database-connection.php";

// Establish a connection to MariaDB
$conn = getDatabaseConnection();

// SQL query to fetch all users
$sql = "SELECT * FROM users"; // Replace `users` with your actual table name
$result = $conn->query($sql);

if ($result) {
    $users = [];

    // Fetch all rows into an associative array
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    // Return the users as JSON
    if (!empty($users)) {
        echo json_encode(["message" => "Users retrieved successfully.", "users" => $users]);
    } else {
        echo json_encode(["message" => "No users found in the database."]);
    }

    // Free the result set
    $result->free();
} else {
    // Handle SQL query error
    echo json_encode(["error" => "SQL error: " . $conn->error]);
}

// Close the connection
$conn->close();

?>
