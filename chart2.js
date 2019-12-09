

var datagroup = [
  [//Africa 32.796  231.12  10.16 92.108  1.1168
    {axis:"Economic Sustainability",value:32.8},
    {axis:"Health Expenditure",value:231},
    {axis:"School Years",value:10.2},
    {axis:"Employment Rate",value:92.1},
    {axis:"Government Effectiveness",value:1.12},
  ],[//Arab States 48.3 1188.444444 12.88888889 90.26666667 0.553333333
    {axis:"Economic Sustainability",value:48.3},
    {axis:"Health Expenditure",value:1188},
    {axis:"School Years",value:12.9},
    {axis:"Employment Rate",value:90.3},
    {axis:"Government Effectiveness",value:0.55},
  ],[//Asia & Pacific 51.305  1171.25 13.4  94.515  0.225
    {axis:"Economic Sustainability",value:51.3},
    {axis:"Health Expenditure",value:1171},
    {axis:"School Years",value:13.4},
    {axis:"Employment Rate",value:94.5},
    {axis:"Government Effectiveness",value:0.23},
  ],[//Europe 68.2825 2832.7  16.325  91.16 -0.369
    {axis:"Economic Sustainability",value:68.3},
    {axis:"Health Expenditure",value:2833},
    {axis:"School Years",value:16.3},
    {axis:"Employment Rate",value:91.2},
    {axis:"Government Effectiveness",value:-0.37},
  ],[//North America 76 9536  17  95.1  -0.74
    {axis:"Economic Sustainability",value:76.0},
    {axis:"Health Expenditure",value:9536},
    {axis:"School Years",value:17.0},
    {axis:"Employment Rate",value:95.1},
    {axis:"Government Effectiveness",value:-0.74},
  ],[//South/Latin America 51.74285714  1073.071429 13.92857143 92.76428571 -0.439285714
    {axis:"Economic Sustainability",value:51.7},
    {axis:"Health Expenditure",value:1073},
    {axis:"School Years",value:13.9},
    {axis:"Employment Rate",value:92.8},
    {axis:"Government Effectiveness",value:-0.44},
  ],
  
];


var dataSelect1 = "Africa";
var dataSelect2 = "Europe";

var selectdata1 = ["Africa", "Arab States", "Asia & Pacific", "Europe", "North America", "South America"]

var selectdata2 = ["Europe", "North America", "South America", "Africa", "Arab States", "Asia & Pacific"]

var select1 = d3.select('#selection')
  .append('select')
  .attr('class','custom-select')
  .on('change',onchange)

var select2 = d3.select('#selection')
  .append('select')
  .attr('class','custom-select')
  .on('change',onchange)

var options1 = select1
  .selectAll('option')
  .data(selectdata1).enter()
  .append('option')
  .text(function (d) { return d; });

var options2 = select2
  .selectAll('option')
  .data(selectdata2).enter()
  .append('option')
  .text(function (d) { return d; });

function onchange() {
  dataSelect1 = select1.property('value')
  dataSelect2 = select2.property('value')
  data_teams = [dataSelect1, dataSelect2];
  data = [datagroup[team[dataSelect1]], datagroup[team[dataSelect2]]];
  // console.log("data_teams", data_teams)

  d3.selectAll('.plotcircle').remove();
  d3.selectAll('.plotlegend').remove();
  draw();
};

var team = {"Africa":0, "Arab States":1, "Asia & Pacific":2, "Europe":3, "North America":4, "South America":5}

var data = [datagroup[team[dataSelect1]], datagroup[team[dataSelect2]]];

// console.log("data", data)

var data_teams = [dataSelect1, dataSelect2];

// console.log("data_teams", data_teams)

var colors = ["#2c3e50","#85c1e9","#717d7e", "#1b4f72", "#922b21","#ca6f1e"]

var maxValues = [];
for(var i=0; i<data[0].length; i++){
  maxValues.push(d3.max(data.map(d => d[i].value)));
}

var axesDomain = data[0].map(d => d.axis)

// console.log("axesDomain", axesDomain)

var axesLength =  data[0].length

var formatPercent = d3.format(',.0%')

var wrapWidth = 60

var axisLabelFactor = 1.20

var axisCircles = 2

var dotRadius = 4

var margin = 30

var height = 600

var radius = (height-(margin*2)) / 2

var width = 900

var levels = 5



var angleSlice = Math.PI * 2 / axesLength


var rScale = maxValues.map(el => d3.scaleLinear().domain([0, el]).range([0, radius]))


var color = function(){
  let index1 = team[dataSelect1];
  let index2 = team[dataSelect2];
  return d3.scaleOrdinal().range([colors[index1], colors[index2]]);
}


const svg2 = d3.select("#radar").append('svg')
      .attr('width', width)
      .attr('height', height+(margin*2));

const containerWidth = width-(margin*2);
const containerHeight = height-(margin*2);
const container = svg2.append('g')
  .attr("width", containerWidth)
  .attr("height", containerHeight)
  .attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);

var axisGrid = container.append("g")
  .attr("class", "axisWrapper");

axisGrid.selectAll(".levels")
// axisGrid.selectAll("circle")
   .data(d3.range(1,(axisCircles+1)).reverse())
   // .data(data)
   .enter().append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d, i) => radius/axisCircles*d)
    .style("fill", "#D6EAF8")
    .style("stroke", "#D6EAF8")
    .style("fill-opacity", 0.5);

axisGrid.selectAll(".axisLabel")
// axisGrid.selectAll("text")
   .data(d3.range(1,(levels+1)).reverse())
   .enter().append("text")
   .attr("class", "axisLabel")
   .attr("x", 4)
   .attr("y", function(d){return -d*radius/levels;})
   .attr("dy", "0.4em")
   .style("font-size", "12px")
   .attr("fill", "white")
   .text(function(d,i) {return Object.values(maxValues)[0] * d/levels; });

const axis = axisGrid.selectAll(".axis")
  .data(axesDomain)
  .enter()
    .append("g")
    .attr("class", "axis");

axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => radius*1.1 * Math.cos(angleSlice*i - Math.PI/2))
    .attr("y2", (d, i) => radius*1.1 * Math.sin(angleSlice*i - Math.PI/2))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

axis.append("text")
  .attr("class", "legend")
  .style("font-size", "14px")
  .attr("text-anchor", "middle")
  .attr("font-family", "Georgia")
  .attr("fill", "white")
  .attr("dy", "0.35em")
  .attr("x", (d, i) => radius * axisLabelFactor * Math.cos(angleSlice*i - Math.PI/2))
  .attr("y", (d, i) => radius * axisLabelFactor * Math.sin(angleSlice*i - Math.PI/2))
  .text(d => d);

var radarLine = d3.lineRadial()
  .curve(d3["curveCardinalClosed"])
  .radius((d, i) => rScale[i](d))
  .angle((d, i) => i * angleSlice)


function draw(){

  const plots = container.append('g')
    .selectAll('g')
    .data(data)
    // .join('g')
    .enter().append('g')
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("class", "plotcircle");

   plots.append('path')
    // .attr("d", d => radarLine(d.map(v => v.value)))
    .attr("d", d => radarLine(data[0].map(v => v.value)))
    .attr("fill", (d, i) => colors[team[dataSelect1]])
    .attr("fill-opacity", 0.1)
    .attr("stroke", (d, i) => colors[team[dataSelect1]])
    .attr("stroke-width", 2);

  plots.append('path')
    .attr("d", d => radarLine(data[1].map(v => v.value)))
    .attr("fill", (d, i) => colors[team[dataSelect2]])
    .attr("fill-opacity", 0.1)
    .attr("stroke", (d, i) => colors[team[dataSelect2]])
    .attr("stroke-width", 2);

  plots.selectAll("circle")
    .data(d => d)
    // .join("circle")
    .enter().append("circle")
    .attr("r", dotRadius)
    .attr("cx", (d,i) => rScale[i](d.value) * Math.cos(angleSlice*i - Math.PI/2))
    .attr("cy", (d,i) => rScale[i](d.value) * Math.sin(angleSlice*i - Math.PI/2))
    .style("fill-opacity", 0.9);

  const legend = container.append('text')
                  .attr("class", "plotlegend")
                  .attr("y", -300)
                  .attr("x", 300)
                  .text(data_teams[0])
                  .attr("font-family", "Georgia")
                  .attr("fill", "white")

  const legend2 = container.append('text')
                  .attr("class", "plotlegend")
                  .attr("y", -280)
                  .attr("x", 300)
                  .text(data_teams[1])
                  .attr("font-family", "Georgia")
                  .attr("fill", "white")

  const legend_circle = container.append('circle')
                        .attr("class", "plotlegend")
                        .attr("cy", -305)
                        .attr("cx", 285)
                        .attr("r", 5)
                        .style("fill", colors[team[dataSelect1]])

                      
  const legend2_circle = container.append('circle')
                         .attr("class", "plotlegend")
                         .attr("cy", -285)
                         .attr("cx", 285)
                         .attr("r", 5)
                         .style("fill", colors[team[dataSelect2]])

}

draw();
