
d3.csv('https://gist.githubusercontent.com/Zach-Ziyi-Liu/d43f68373f0b2a8fc37970572c03bf7d/raw/75ce6e15df57cb0e6098ca77f532a00d02b23284/coffee.csv', function loadCallback(error, data) {
    data.forEach(function(d) { // convert strings to numbers
        d.happiness_score = +d.happiness_score;
        d.coffee_consumption = +d.coffee_consumption;
    });
    makeVis(data);
});

var makeVis = function(data) {
    // Common pattern for defining vis size and margins
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width  = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Add the visualization svg canvas to the vis-container <div>
    var canvas = d3.select("#vis-container").append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom + 30)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define our scales
    // var colorScale = d3.scale.category10();
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // var xScale = d3.scale.linear()
   var xScale = d3.scaleLinear()
        .domain([ d3.min(data, function(d) { return d.coffee_consumption; }) - 1,
                d3.max(data, function(d) { return d.coffee_consumption; }) + 1 ])
        .range([0, width]);

    // var yScale = d3.scale.linear()
    var yScale = d3.scaleLinear()
        .domain([ d3.min(data, function(d) { return d.happiness_score; }) - 1,
                d3.max(data, function(d) { return d.happiness_score; }) + 1 ])
        .range([height, 0]); // flip order because y-axis origin is upper LEFT

    // Define our axes
    // var xAxis = d3.svg.axis()
    //     .scale(xScale)
    //     .orient('bottom');

    var xAxis = d3.axisBottom(xScale);

    // var yAxis = d3.svg.axis()
    //     .scale(yScale)
    //     .orient('left');

    var yAxis = d3.axisLeft(yScale);

    // Add x-axis to the canvas
    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
        .call(xAxis);

    // .append("text")
    //     .attr("class", "label")
    //     .attr("x", width) // x-offset from the xAxis, move label all the way to the right
    //     .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
    //     .style("text-anchor", "end") // right-justify text
    //     .text("Coffee Consumption");

    canvas.append("text")
        .style("fill", "white")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Coffee Consumption");

    // Add y-axis to the canvas
    canvas.append("g")
        .attr("class", "y axis") // .orient('left') took care of axis positioning for us
        .call(yAxis);

    canvas.append("text")
        .style("fill", "white")
        .attr("class", "label")
        .attr("transform", "rotate(-90)") // although axis is rotated, text is not
        .attr("y", 20) // y-offset from yAxis, moves text to the RIGHT because it's rotated, and positive y is DOWN
        .style("text-anchor", "end")
        .text("Happiness Score");

    // canvas.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "2px")
    //     .style("text-anchor", "middle")
    //     .text("Happiness Score");

    // Add the tooltip container to the vis container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3.select("#tip1").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // tooltip mouseover event handler
    var tipMouseover = function(d) {
        var color = colorScale(d.region);
        var html  = d.country + "<br/>" +
                    "<span style='color:" + color + ";'>" + d.region + "</span><br/>" +
                    "<b>" + d.coffee_consumption + "</b> kg coffee consumed per capita, <b/>" + d.happiness_score + "</b> happiness score";

        tooltip.html(html)
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY + 30) + "px")
        .transition()
            .duration(200) // ms
            .style("opacity", 1); // started as 0!

        // console.log(d3.event.pageX, d3.event.pageY);

    };

    // tooltip mouseout event handler
    var tipMouseout = function(d) {
        tooltip.transition()
            .duration(300) // ms
            .style("opacity", 0); // don't care about position!
    };

    // Add data points!
    canvas.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5.5) // radius size, could map to another data dimension
        .attr("cx", function(d) { return xScale( d.coffee_consumption ); })     // x position
        .attr("cy", function(d) { return yScale( d.happiness_score ); })  // y position
        .style("fill", function(d) { return colorScale(d.region); })
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);
};
