<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map Creator</title>
    <link rel="stylesheet" href="styles2.css">
</head>
<body>

    <!-- Container for the map and buttons -->
    <div class="map-container">
        <!-- Map section that will be shown immediately when the page loads -->
        <div id="mapSection" class="map-section">
            <div id="plane" class="plane"></div>

            <!-- Table to display nodes -->
            <table id="nodeTable" border="1" style="width: 100%; margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Node No.</th>
                        <th>Node Name</th>
                        <th>X Coordinates</th>
                        <th>Y Coordinates</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Node data will be inserted here -->
                </tbody>
            </table>

            <!-- Table for Edges -->
            <table id="edgeTable" border="1" style="width: 100%; margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Start Node</th>
                        <th>End Node</th>
                        <th>Distance (Manhattan)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Edge data will be inserted here -->
                </tbody>
            </table>

            <!-- Form to manually add coordinates -->
            <div id="manualInput" class="manual-input">
                <label for="xCoord">X Coordinate: </label>
                <input type="number" id="xCoord" min="0" step="10" placeholder="X Coordinate">
                <label for="yCoord">Y Coordinate: </label>
                <input type="number" id="yCoord" min="0" step="10" placeholder="Y Coordinate">
                <label for="nodeName">Node Name: </label>
                <input type="text" id="nodeName" placeholder="Enter Node Name (optional)">
                <button id="addPointManually">Add Point Manually</button>
            </div>

            <!-- Other buttons -->
            <div class="buttons-container">
                <button id="createEdgeBtn">Create Edge</button>
            </div>
        </div>
        <input type="text" id="mapName" placeholder="Enter Map Name">    
        <button id="submit">Submit</button><br>
        <a href="main.php"><button id="Home">Home</button></a>
    </div>
    <script src="script.js"></script>
</body>
</html>
