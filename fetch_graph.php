<?php
$servername = "localhost";
$username = "root";
$password = "ak@AK123";
$dbname = "graph";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed!"]));
}

$mapId = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

$sql = "SELECT graph FROM graph_data WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $mapId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row["graph"]; // Output JSON directly
} else {
    echo json_encode(["error" => "No graph data found"]);
}

$stmt->close();
$conn->close();
?>
