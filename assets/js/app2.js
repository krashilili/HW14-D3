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

    var formatPercent = d3.format('.1%');

    var margin = {
        top: 50,
        bottom: 100,
        right: 40,
        left: 150
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
           data.age = +data.age;
           data.smokes = +data.smokes;
           data.income = +data.income;
           data.obesity = +data.obesity;
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
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .on('mouseover', function () {
                d3.select(this)
                  .transition()
                  .duration(100)
                  .attr('r',10)
                  .attr('stroke-width',2)
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r',10)
                    .attr('stroke-width',1)
            })
            .append('title') // Tooltip
            .text(function(d){
                return d.state +
                    '\nPoverty: '+formatPercent(d.poverty/100) +
                    '\nLacks Healthcare: '+formatPercent(d.healthcare/100)

            });

        // append texts to the circles
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



        // Create x axis labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 100 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 80 - margin.left-10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smokes (%)");

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 40 - margin.left-10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obese (%)");

        // Create y axis labels
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Age (Median)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 50})`)
            .attr("class", "axisText")
            .text("Household Income (Median)");

        // create axes
        var xAxis = d3.axisBottom(xLinearScale).ticks(8);
        var yAxis = d3.axisLeft(yLinearScale);

        // append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);


        chartGroup.append("g")
            .call(yAxis);


        function xChange() {
            var value = this.value;// get the new x value
            xLinearScale // change the xScale
                .domain([
                    d3.min([0,d3.min(data,function (d) { return d[value] })]),
                    d3.max([0,d3.max(data,function (d) { return d[value] })])
                ]);
            xAxis.scale(xLinearScale); // change the xScale
            d3.select('#xAxis') // redraw the xAxis
                .transition().duration(1000)
                .call(xAxis)
            d3.select('#xAxisLabel') // change the xAxisLabel
                .transition().duration(1000)
                .text(value)
            d3.selectAll('circle') // move the circles
                .transition().duration(1000)
                .delay(function (d,i) { return i*100})
                .attr('cx',function (d) { return xScale(d[value]) })
        }
    }
}