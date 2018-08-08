// @TODO: YOUR CODE HERE!


// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // read csv
    var filePath = 'assets/data/data.csv';

    d3.csv(filePath).then(successHandle, errorHandle);

    function errorHandle(error) {
        console.log("Failed to load the csv file!");
    }

    function successHandle(medalData) {
        // parse data
        medalData.forEach(function(data){
           data.poverty = +data.poverty;
           data.healthcare = +data.healthcare;
        });

        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(medalData, d => d.poverty))
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(medalData, d => d.healthcare)])
            .range([height, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(medalData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "gold")
            .attr("stroke-width", "1")
            .attr("stroke", "black");
    }
}