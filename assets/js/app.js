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
    var svgWidth = window.innerWidth*.5;
    var svgHeight = window.innerHeight*.9;

    var margin = {
        top: 50,
        bottom: 100,
        right: 40,
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
        throw error;
    }

    function successHandle(medalData) {
        // parse data
        medalData.forEach(function(data){
           data.poverty = +data.poverty;
           data.healthcare = +data.healthcare;
        });

        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(medalData, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([4, d3.max(medalData, d => d.healthcare)])
            .range([height, 0]);


        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(medalData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "#9CCDE2")
            .attr("stroke-width", "1")
            .attr("stroke", "black");

        // append texts
        var textsGroup = chartGroup.selectAll('text')
            .data(medalData)
            .enter()
            .append('text')
            .text(function (d) {return d.abbr;})
            .attr("x", function(d){ return xLinearScale(d.poverty)-3;})
            .attr("y", function(d){ return yLinearScale(d.healthcare);})
            .attr("font-family", "sans-serif")
            .attr('font-size', '8px')
            .attr('fill','white')
            .attr('font-weight','bold');



        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");

        // create axes
        var xAxis = d3.axisBottom(xLinearScale).ticks(8);
        var yAxis = d3.axisLeft(yLinearScale);

        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);


        chartGroup.append("g")
            .call(yAxis);
    }
}