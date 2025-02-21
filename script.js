let pointCounter = 0; // Counter for node numbers
let points = []; // Store points with their names and coordinates
let edges = []; // Store edges as pairs of node indices

const plane = document.getElementById("plane");
const createEdgeBtn = document.getElementById("createEdgeBtn");
const addPointManuallyBtn = document.getElementById("addPointManually");
const xCoordInput = document.getElementById("xCoord");
const yCoordInput = document.getElementById("yCoord");
const nodeNameInput = document.getElementById("nodeName");
const nodeTableBody = document.getElementById("nodeTable").getElementsByTagName("tbody")[0];
const edgeTableBody = document.getElementById("edgeTable").getElementsByTagName("tbody")[0];

// Event listener to add point manually (enter X, Y coordinates, and optionally name)
addPointManuallyBtn.addEventListener("click", () => {
    const x = parseInt(xCoordInput.value);
    const y = parseInt(yCoordInput.value);
    const nodeName = nodeNameInput.value.trim() || `Node ${pointCounter}`; // Default name if not provided

    if (isNaN(x) || isNaN(y)) {
        alert("Please enter valid coordinates.");
        return;
    }

    const pointName = pointCounter; // Use the current value of pointCounter as the point name
    pointCounter++; // Increment the counter for the next point

    // Create a new point element on the map
    const point = document.createElement("div");
    point.className = "point";
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;

    // Create and position the label for the point
    const label = document.createElement("div");
    label.className = "tooltip";
    label.textContent = `${nodeName}: (${x}, ${y})`;

    label.style.left = `${x + 15}px`;
    label.style.top = `${y - 15}px`;

    // Add the point and its label to the plane
    plane.appendChild(point);
    plane.appendChild(label);

    // Store the point
    points.push({ x, y, name: nodeName, pointElement: point, labelElement: label });

    // Update the table with the new node
    updateNodeTable(nodeName, x, y);
});

// Function to update the table with new node information
function updateNodeTable(nodeName, x, y) {
    const newRow = nodeTableBody.insertRow();
    newRow.insertCell(0).textContent = pointCounter - 1; // Node No. (use current pointCounter as index)
    newRow.insertCell(1).textContent = nodeName;
    newRow.insertCell(2).textContent = x;
    newRow.insertCell(3).textContent = y;

    // Create edit and delete buttons
    const editCell = newRow.insertCell(4);

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        editNode(newRow, pointCounter - 1);
    });
    editCell.appendChild(editButton);
}

// Event listener to add point by clicking on the grid
plane.addEventListener("click", (event) => {
    // Get the coordinates relative to the plane (grid)
    const rect = plane.getBoundingClientRect();
    const x = event.clientX - rect.left; // X coordinate relative to the grid
    const y = event.clientY - rect.top;  // Y coordinate relative to the grid

    const nodeName = `Node ${pointCounter}`; // Use the current value of pointCounter as the point name
    pointCounter++; // Increment the counter for the next point

    // Create a new point element on the map
    const point = document.createElement("div");
    point.className = "point";
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;

    // Create and position the label for the point
    const label = document.createElement("div");
    label.className = "tooltip";
    label.textContent = `${nodeName}: (${x}, ${y})`;

    label.style.left = `${x + 15}px`;
    label.style.top = `${y - 15}px`;

    // Add the point and its label to the plane
    plane.appendChild(point);
    plane.appendChild(label);

    // Store the point
    points.push({ x, y, name: nodeName, pointElement: point, labelElement: label });

    // Update the table with the new node
    updateNodeTable(nodeName, x, y);
});

// Function to edit a node
function editNode(row, index) {
    const node = points[index];
    const newName = prompt("Enter new name:", node.name);
    const newX = parseInt(prompt("Enter new X coordinate:", node.x));
    const newY = parseInt(prompt("Enter new Y coordinate:", node.y));

    if (newName && !isNaN(newX) && !isNaN(newY)) {
        // Update the point coordinates and name
        node.name = newName;
        node.x = newX;
        node.y = newY;

        // Update the label and point element position
        node.labelElement.textContent = `${newName}: (${newX}, ${newY})`;
        node.labelElement.style.left = `${newX + 15}px`;
        node.labelElement.style.top = `${newY - 15}px`;

        node.pointElement.style.left = `${newX}px`;
        node.pointElement.style.top = `${newY}px`;

        // Update the table row
        row.cells[1].textContent = newName;
        row.cells[2].textContent = newX;
        row.cells[3].textContent = newY;
    }
}

// Function to calculate Manhattan distance
function calculateManhattanDistance(node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}

// Event listener to create an edge and calculate Manhattan distance
createEdgeBtn.addEventListener("click", () => {
    const startNodeNo = parseInt(prompt("Enter the starting node number:"));
    const endNodeNo = parseInt(prompt("Enter the ending node number:"));

    if (isNaN(startNodeNo) || isNaN(endNodeNo)) {
        alert("Please enter valid node numbers.");
        return;
    }

    // Get the nodes from the points array
    const startNode = points[startNodeNo];
    const endNode = points[endNodeNo];

    if (!startNode || !endNode) {
        alert("Invalid node numbers. Please make sure the nodes exist.");
        return;
    }

    // Ask user for manual distance input
    const useManualDistance = confirm("Do you want to manually enter the distance? Click 'OK' for Yes or 'Cancel' for Default.");

    let distance;
    if (useManualDistance) {
        const userDistance = parseFloat(prompt("Enter the distance between nodes:"));
        if (isNaN(userDistance) || userDistance <= 0) {
            alert("Invalid distance entered. Using Manhattan distance.");
            distance = calculateManhattanDistance(startNode, endNode);
        } else {
            distance = userDistance;
        }
    } else {
        distance = calculateManhattanDistance(startNode, endNode);
    }

    console.log(`Edge created: ${startNodeNo} -> ${endNodeNo}, Distance: ${distance}`);

    // Create a new edge (line) between the two nodes
    const edge = document.createElement("div");
    edge.className = "edge";

    // Calculate the line position and size based on the coordinates
    const x1 = startNode.x;
    const y1 = startNode.y;
    const x2 = endNode.x;
    const y2 = endNode.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy); // Length of the edge
    const angle = Math.atan2(dy, dx) * 180 / Math.PI; // Angle in degrees

    edge.style.position = "absolute"; // Important to position the edge relative to the grid
    edge.style.width = `${length}px`;
    edge.style.transformOrigin = "0 0"; // Ensure the rotation is around the starting node
    edge.style.transform = `rotate(${angle}deg)`;
    edge.style.left = `${x1}px`; // Position relative to the plane
    edge.style.top = `${y1}px`;  // Position relative to the plane

    // Optionally, add a border to make the edge visible
    edge.style.border = "2px solid black"; // You can customize the edge style

    // Add the edge to the plane
    plane.appendChild(edge);

    // Store the edge
    edges.push({ startNode, endNode, edgeElement: edge });

    // Update the edge table with the new edge and its Manhattan distance
    const newRow = edgeTableBody.insertRow();
    newRow.insertCell(0).textContent = startNode.name;
    newRow.insertCell(1).textContent = endNode.name;
    newRow.insertCell(2).textContent = distance; 

    const newRow2 = edgeTableBody.insertRow();
    newRow2.insertCell(0).textContent = endNode.name;
    newRow2.insertCell(1).textContent = startNode.name;
    newRow2.insertCell(2).textContent = distance;// Correctly displaying distance
});



function buildAdjacencyList() {
    let adjList = {};
    let nodeCoordinates = {};

    // Extract nodes from the table (including coordinates)
    document.querySelectorAll("#nodeTable tbody tr").forEach(row => {
        let cells = row.children;
        let nodeName = cells[1].textContent.trim(); // Node Name
        let x = parseInt(cells[2].textContent.trim()); // X coordinate
        let y = parseInt(cells[3].textContent.trim()); // Y coordinate

        if (nodeName) {
            adjList[nodeName] = []; // Initialize adjacency list for the node
            nodeCoordinates[nodeName] = { x: x, y: y }; // Store node coordinates
        }
    });

    // Extract edges and build adjacency list
    document.querySelectorAll("#edgeTable tbody tr").forEach(row => {
        let cells = row.children;
        let startNode = cells[0].textContent.trim();
        let endNode = cells[1].textContent.trim();
        let distance = parseInt(cells[2].textContent.trim());

        if (adjList[startNode]) {
            adjList[startNode].push({ node: endNode, distance: distance });
        }
    });

    return { adjacencyList: adjList, nodeCoordinates: nodeCoordinates };
}

// Example usage:
console.log(buildAdjacencyList());

submit.addEventListener("click", function () {
    let mapName = document.getElementById("mapName").value.trim();
    let graphData = buildAdjacencyList(); // Get adjacency list + coordinates
    let jsonData = JSON.stringify(graphData);
    fetch("save_graph.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mapName: mapName, data: graphData }) // Send structured JSON
    })

    .then(response => response.text())
    .then(data => {
        console.log("Response:", data);
        alert(`Graph saved successfully! ${data}`);
    })
    .catch(error => console.error("Error:", error));
});

