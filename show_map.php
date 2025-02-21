<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Show Map</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        svg {
            border: 1px solid black;
            background-color: #f8f9fa;
        }
        .node {
            fill: steelblue;
            stroke: black;
            stroke-width: 2px;
        }
        .edge {
            stroke: black;
            stroke-width: 2px;
        }
        .edge-label {
            font-size: 20px;
            fill: red;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <h2>Enter Map ID</h2>
    <input type="number" id="mapId" placeholder="Enter Map ID">
    <button onclick="fetchGraph()">Submit</button>
    <a href="main.php"><button>Home</button></a>

    <h2>Graph Visualization</h2>
    <svg id="graphCanvas" width="1500" height="600"></svg>
    <h3>Find Shortest Path</h3>
<input type="text" id="startNode" placeholder="Start Node">
<input type="text" id="endNode" placeholder="End Node">
<button onclick="findPath()">Find Path</button>

<h3>Shortest Path:</h3>
<p id="pathResult"></p>
    <script>
        let storedGraph = null;
        function fetchGraph() {
            let mapId = document.getElementById("mapId").value.trim();
            if (!mapId) {
                alert("Please enter a valid Map ID!");
                return;
            }

            fetch("fetch_graph.php?id=" + mapId)
                .then(response => response.json())
                .then(data => {
                    if (!data || data.error) {
                        alert("Map not found!");
                    } else {
                        storedGraph = data; // Store graph data globally
                        drawGraph(data);
                    }
                })
                .catch(error => console.error("Error:", error));
        }

        function drawGraph(graphData) {
            if (!graphData || graphData.error) {
                alert("Map not found!");
                return;
            }

            const adjacencyList = graphData.adjacencyList;
            const nodeCoordinates = graphData.nodeCoordinates;

            const svg = d3.select("#graphCanvas");
            svg.selectAll("*").remove(); // Clear previous graph

            // Draw edges with distance labels
            Object.keys(adjacencyList).forEach(startNode => {
                adjacencyList[startNode].forEach(edge => {
                    let x1 = nodeCoordinates[startNode].x;
                    let y1 = nodeCoordinates[startNode].y;
                    let x2 = nodeCoordinates[edge.node].x;
                    let y2 = nodeCoordinates[edge.node].y;

                    // Draw edge (line)
                    svg.append("line")
                        .attr("x1", x1)
                        .attr("y1", y1)
                        .attr("x2", x2)
                        .attr("y2", y2)
                        .attr("class", "edge");

                    // Calculate mid-point for distance label
                    let midX = (x1 + x2) / 2;
                    let midY = (y1 + y2) / 2;

                    // Add distance label
                    svg.append("text")
                        .attr("x", midX)
                        .attr("y", midY - 20) // Slightly above the line
                        .text(edge.distance)
                        .attr("class", "edge-label");
                });
            });

            // Draw nodes
            Object.keys(nodeCoordinates).forEach(node => {
                let { x, y } = nodeCoordinates[node];

                svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 10)
                    .attr("class", "node");

                svg.append("text")
                    .attr("x", x + 15)
                    .attr("y", y)
                    .text(node)
                    .attr("font-size", "14px")
                    .attr("fill", "black");
            });
        }
        function findPath() {
            if (!storedGraph) {
                alert("Graph not loaded! Please enter a valid Map ID and submit.");
                return;
            }

            let startNode = document.getElementById("startNode").value.trim();
            let endNode = document.getElementById("endNode").value.trim();

            if (!startNode || !endNode) {
                alert("Please enter valid start and end nodes.");
                return;
            }

            let shortestPath = dijkstra(storedGraph.adjacencyList, startNode, endNode);
            
            if (!shortestPath) {
                document.getElementById("pathResult").innerHTML = "❌ No valid path found!";
            } else {
                document.getElementById("pathResult").innerHTML = 
                    `✅ Shortest Path: ${shortestPath.path.join(" ➝ ")} <br> 🚀 Distance: ${shortestPath.distance}`;
            }
        }

        function dijkstra(graph, start, end) {
            if (!graph[start] || !graph[end]) {
                return null; // Invalid nodes
            }

            let distances = {};
            let previousNodes = {};
            let unvisited = new Set(Object.keys(graph));

            // Initialize distances
            Object.keys(graph).forEach(node => distances[node] = Infinity);
            distances[start] = 0;

            while (unvisited.size > 0) {
                let currentNode = Array.from(unvisited).reduce((a, b) => 
                    distances[a] < distances[b] ? a : b
                );

                unvisited.delete(currentNode);

                if (distances[currentNode] === Infinity) break;
                if (currentNode === end) break;

                graph[currentNode].forEach(neighbor => {
                    let { node, distance } = neighbor;
                    let newDistance = distances[currentNode] + distance;

                    if (newDistance < distances[node]) {
                        distances[node] = newDistance;
                        previousNodes[node] = currentNode;
                    }
                });
            }

            if (distances[end] === Infinity) return null;

            let path = [];
            let step = end;
            while (step) {
                path.unshift(step);
                step = previousNodes[step];
            }

            return { path, distance: distances[end] };
        }
    </script>
</body>
</html>