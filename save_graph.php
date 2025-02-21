<?php
$servername = "localhost";
$username = "root";
$password = "ak@AK123";
$dbname = "graph";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    die("No data received!");
}

$mapName = $conn->real_escape_string($data["mapName"]);
$graphJson = $conn->real_escape_string(json_encode($data["data"], JSON_UNESCAPED_SLASHES));

// Insert into database
$sql = "INSERT INTO graph_data (map_name, graph) VALUES ('$mapName', '$graphJson')";
if ($conn->query($sql) === TRUE) {
    $map_id = $conn->insert_id; // Get the last inserted ID
    echo json_encode(["success" => true, "message" => "Graph saved successfully!", "map_id" => $map_id]);
    echo "Graph saved successfully!";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
