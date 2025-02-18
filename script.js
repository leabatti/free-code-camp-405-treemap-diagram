// Fetch Data
d3.json(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
).then((fetchedData) => {
  const data = fetchedData;

  // Chart Dimensions
  const width = 1000;
  const height = 700;
  const padding = 10;

  // Create SVG
  const svg = d3.select("#chart").attr("width", width).attr("height", height);

  // Color Scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Create Treemap
  const treemap = d3.treemap().size([width, height]).padding(1);

  // Create Hierarchy
  const root = d3.hierarchy(data).sum((d) => d.value);

  // Create Nodes
  const nodes = treemap(root).leaves();

  // Create Cells
  const cell = svg
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

  // Create Tiles
  cell
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => color(d.data.category))
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("rx", 5)
    .attr("ry", 5)
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  const lineHeight = 12; // Ajusta esta variable según el interlineado deseado

  // Add Text
  cell
    .append("text")
    .attr("class", "cell-text")
    .attr("x", 5)
    .attr("y", 15)
    .selectAll("tspan")
    .data((d) => d.data.name.split(" "))
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("dy", (d, i) => (i === 0 ? 0 : lineHeight))
    .text((d) => d);

  // Helper function to truncate text
  function truncateText(text, width, height) {
    const charWidth = 7;
    const maxChars = Math.floor(width / charWidth);
    if (text.length > maxChars) {
      return text.substring(0, maxChars - 3) + "...";
    } else {
      return text;
    }
  }

  // Create Tooltip
  const tooltip = d3.select("#tooltip");

  function showTooltip(event, d) {
    tooltip
      .style("display", "block")
      .style("left", event.pageX - 140 + "px")
      .style("top", event.pageY - 10 + "px")
      .attr("data-value", d.data.value)
      .html(
        `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
      );
  }

  function hideTooltip() {
    tooltip.style("display", "none");
  }

  // Legend
  const legendColors = [
    { color: "#1f77b4", text: "Action" },
    { color: "#8c564b", text: "Comedy" },
    { color: "#ff7f0e", text: "Drama" },
    { color: "#2ca02c", text: "Adventure" },
    { color: "#d62728", text: "Family" },
    { color: "#9467bd", text: "Animation" },
    { color: "#e377c2", text: "Biography" },
  ];
  const legend = d3.select("#legend");

  legend
    .selectAll(".legend-item")
    .data(legendColors)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .style("background-color", (d) => d.color)
    .text((d) => d.text);
});
