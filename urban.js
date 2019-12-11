
d3.csv('https://gist.githubusercontent.com/Zach-Ziyi-Liu/52de164640385b562d533c0f9100a917/raw/711c4d7ce9cf7427f766c87b6c61fe96c293131d/urban_full.csv', function loadCallback2(error, data2) {
    data2.forEach(function(d) { // convert strings to numbers
        d.world_happiness_score = +d.world_happiness_score;
        d.urban_pop = +d.urban_pop;
    });
    makeVis2(data2);
});

var makeVis2 = function(data2) {
    // Common pattern for defining vis size and margins
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width  = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Add the visualization svg canvas to the vis-container <div>
    var canvas2 = d3.select("#vis-container2").append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom + 30)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define our scales
    // var colorScale = d3.scale.category10();
    var colorScale2 = d3.scaleOrdinal(d3.schemeCategory10);

    // var xScale = d3.scale.linear()
    var xScale2 = d3.scaleLinear()
        .domain([ d3.min(data2, function(d) { return d.urban_pop; }) - 1,
                d3.max(data2, function(d) { return d.urban_pop; }) + 1 ])
        .range([0, width]);

    // var yScale = d3.scale.linear()
    var yScale2 = d3.scaleLinear()
        .domain([ d3.min(data2, function(d) { return d.world_happiness_score; }) - 1,
                d3.max(data2, function(d) { return d.world_happiness_score; }) + 1 ])
        .range([height, 0]); // flip order because y-axis origin is upper LEFT

    // Define our axes
    // var xAxis = d3.svg.axis()
    //     .scale(xScale)
    //     .orient('bottom');

    var xAxis2 = d3.axisBottom(xScale2);

    // var yAxis = d3.svg.axis()
    //     .scale(yScale)
    //     .orient('left');

    var yAxis2 = d3.axisLeft(yScale2);

    // Add x-axis to the canvas
    canvas2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") // move axis to the bottom of the canvas
        .call(xAxis2);

    // .append("text")
    //     .attr("class", "label")
    //     .attr("x", width) // x-offset from the xAxis, move label all the way to the right
    //     .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
    //     .style("text-anchor", "end") // right-justify text
    //     .text("Urban Population Percentage");

    canvas2.append("text")
        .style("fill", "white")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Urban Population Percentage");


    // Add y-axis to the canvas
    canvas2.append("g")
        .attr("class", "y axis") // .orient('left') took care of axis positioning for us
        .call(yAxis2);

    canvas2.append("text")
        .style("fill", "white")
        .attr("class", "label")
        .attr("transform", "rotate(-90)") // although axis is rotated, text is not
        .attr("y", 20) // y-offset from yAxis, moves text to the RIGHT because it's rotated, and positive y is DOWN
        .style("text-anchor", "end")
        .text("Happiness Score");

    // Add the tooltip container to the vis container
    // it's invisible and its position/contents are defined during mouseover
    var tooltip2 = d3.select("#tip2").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1);


    // tooltip mouseover event handler
    var tipMouseover2 = function(d) {
        var color = colorScale2(d.region);
        var html  = d.country + "<br/>" +
                    "<span style='color:" + color + ";'>" + d.region + "</span><br/>" +
                    "<b>" + d.urban_pop + "</b> % people living in urban area, <b/>" + d.world_happiness_score + "</b> happiness score";

        tooltip2.html(html)
            // .style("left", (d3.event.pageX + 15) + "px")
            // .style("top", (d3.event.pageY + 30) + "px")
            .style("left", d + "px")
            .style("top", d + "px")
        .transition()
            .duration(200) // ms
            .style("opacity", 1); // started as 0!

    };
    // tooltip mouseout event handler
    var tipMouseout2 = function(d) {
        tooltip2.transition()
            .duration(300) // ms
            .style("opacity", 0); // don't care about position!
    };

    // Add data points!
    canvas2.selectAll(".dot")
    .data(data2)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 5.5) // radius size, could map to another data dimension
    .attr("cx", function(d) { return xScale2( d.urban_pop ); })     // x position
    .attr("cy", function(d) { return yScale2( d.world_happiness_score ); })  // y position
    .style("fill", function(d) { return colorScale2(d.region); })
    .on("mouseover", tipMouseover2)
    .on("mouseout", tipMouseout2);
};
