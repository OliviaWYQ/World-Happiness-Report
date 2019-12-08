var team = {"Africa":0, "Arab States":1, "Asia & Pacific":2, "Europe":3, "North America":4, "South/Latin America":5}

var datagroup = [
  [//Africa 32.796	231.12	10.16	92.108	1.1168
    {axis:"Economic Sustainability",value:32.8},
    {axis:"Health Expenditure",value:231},
    {axis:"School Years",value:10.2},
    {axis:"Employment Rate",value:92.1},
    {axis:"Government Effectiveness",value:1.12},
  ],[//Arab States 48.3	1188.444444	12.88888889	90.26666667	0.553333333
    {axis:"Economic Sustainability",value:48.3},
    {axis:"Health Expenditure",value:1188},
    {axis:"School Years",value:12.9},
    {axis:"Employment Rate",value:90.3},
    {axis:"Government Effectiveness",value:0.55},
  ],[//Asia & Pacific 51.305	1171.25	13.4	94.515	0.225
    {axis:"Economic Sustainability",value:51.3},
    {axis:"Health Expenditure",value:1171},
    {axis:"School Years",value:13.4},
    {axis:"Employment Rate",value:94.5},
    {axis:"Government Effectiveness",value:0.23},
  ],[//Europe 68.2825	2832.7	16.325	91.16	-0.369
    {axis:"Economic Sustainability",value:68.3},
    {axis:"Health Expenditure",value:2833},
    {axis:"School Years",value:16.3},
    {axis:"Employment Rate",value:91.2},
    {axis:"Government Effectiveness",value:-0.37},
  ],[//North America 76	9536	17	95.1	-0.74
    {axis:"Economic Sustainability",value:76.0},
    {axis:"Health Expenditure",value:9536},
    {axis:"School Years",value:17.0},
    {axis:"Employment Rate",value:95.1},
    {axis:"Government Effectiveness",value:-0.74},
  ],[//South/Latin America 51.74285714	1073.071429	13.92857143	92.76428571	-0.439285714
    {axis:"Economic Sustainability",value:51.7},
    {axis:"Health Expenditure",value:1073},
    {axis:"School Years",value:13.9},
    {axis:"Employment Rate",value:92.8},
    {axis:"Government Effectiveness",value:-0.44},
  ],
  
];

function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  const wrapper = html`<div></div>`;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) form.input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
    );
  if (format) format = typeof format === "function" ? format : d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
      ? "onclick"
      : type == "checkbox" || type == "radio"
      ? "onchange"
      : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(form.input) : form.input.value;
      if (form.output) {
        const out = display ? display(value) : format ? format(value) : value;
        if (out instanceof window.Element) {
          while (form.output.hasChildNodes()) {
            form.output.removeChild(form.output.lastChild);
          }
          form.output.append(out);
        } else {
          form.output.value = out;
        }
      }
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  while (form.childNodes.length) {
    wrapper.appendChild(form.childNodes[0]);
  }
  form.append(wrapper);
  return form;
}

function select(config = {}) {
  let {
    value: formValue,
    title,
    description,
    submit,
    multiple,
    size,
    options
  } = Array.isArray(config) ? {options: config} : config;
  options = options.map(
    o => (typeof o === "object" ? o : { value: o, label: o })
  );
  const form = input({
    type: "select",
    title,
    description,
    submit,
    getValue: input => {
      const selected = Array.prototype.filter
        .call(input.options, i => i.selected)
        .map(i => i.value);
      return multiple ? selected : selected[0];
    },
    form: html`
      <form>
        <select name="input" ${
          multiple ? `multiple size="${size || options.length}"` : ""
        }>
          ${options.map(({ value, label }) => Object.assign(html`<option>`, {
              value,
              selected: Array.isArray(formValue)
                ? formValue.includes(value)
                : formValue === value,
              textContent: label
            }))}
        </select>
      </form>
    `
  });
  form.output.remove();
  return form;
}

var dataSelect1 = select({
  title:  "Region 1",
  options: Object.keys(team)
})


var dataSelect2 = select({
  title:  "Region 2",
  options: Object.keys(team)
})

var index1 = team[dataSelect1];
var index2 = team[dataSelect2];

var data = [datagroup[index1], datagroup[index2]];

console.log(index1)

var axesDomain = data[0].map(d => d.axis)

var axesLength =  data[0].length

var formatPercent = d3.format(',.0%')

var wrapWidth = 60

var axisLabelFactor = 1.20

var axisCircles = 2

var dotRadius = 4

var radius = (height-(margin*2)) / 2

var margin = 30

var height = 600

var levels = 5





var data_teams = function(){
  let index1 = team[dataSelect1];
  let index2 = team[dataSelect2];
  return [dataSelect1, dataSelect2];
}

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
const container = svg.append('g')
.attr("width", containerWidth)
.attr("height", containerHeight)
.attr('transform', `translate(${(width/2)+margin}, ${(height/2)+margin})`);

var axisGrid = container.append("g")
.attr("class", "axisWrapper");

axisGrid.selectAll(".levels")
   .data(d3.range(1,(axisCircles+1)).reverse())
   .enter()
  .append("circle")
  .attr("class", "gridCircle")
  .attr("r", (d, i) => radius/axisCircles*d)
  .style("fill", "#D6EAF8")
  .style("stroke", "#D6EAF8")
  .style("fill-opacity", 0.5);

axisGrid.selectAll(".axisLabel")
   .data(d3.range(1,(levels+1)).reverse())
   .enter().append("text")
   .attr("class", "axisLabel")
   .attr("x", 4)
   .attr("y", function(d){return -d*radius/levels;})
   .attr("dy", "0.4em")
   .style("font-size", "12px")
   .attr("fill", "#737373")
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
.attr("font-family", "monospace")
.attr("dy", "0.35em")
	.attr("x", (d, i) => radius * axisLabelFactor * Math.cos(angleSlice*i - Math.PI/2))
	.attr("y", (d, i) => radius * axisLabelFactor * Math.sin(angleSlice*i - Math.PI/2))
	.text(d => d);

const plots = container.append('g')
.selectAll('g')
.data(data)
.join('g')
  .attr("fill", "none")
  .attr("stroke", "steelblue");

plots.append('path')
.attr("d", d => radarLine(d.map(v => v.value)))
.attr("fill", (d, i) => color(i))
.attr("fill-opacity", 0.1)
.attr("stroke", (d, i) => color(i))
.attr("stroke-width", 2);

plots.selectAll("circle")
	.data(d => d)
.join("circle")
	  .attr("r", dotRadius)
	  .attr("cx", (d,i) => rScale[i](d.value) * Math.cos(angleSlice*i - Math.PI/2))
	  .attr("cy", (d,i) => rScale[i](d.value) * Math.sin(angleSlice*i - Math.PI/2))
	  .style("fill-opacity", 0.9);

const legend = container.append('text')
             .attr("y", -300)
             .attr("x", 300)
             .text(data_teams[0])
             .attr("font-family", "monospace")

const legend2 = container.append('text')
              .attr("y", -280)
              .attr("x", 300)
              .text(data_teams[1])
              .attr("font-family", "monospace")

const legend_circle = container.append('circle')
                    .attr("cy", -305)
                    .attr("cx", 285)
                    .attr("r", 5)
                    .style("fill", colors[team[dataSelect1]])

                  
const legend2_circle = container.append('circle')
                     .attr("cy", -285)
                     .attr("cx", 285)
                     .attr("r", 5)
                     .style("fill", colors[team[dataSelect2]])
                     .attr("font-family", "monospace")



var radarLine = d3.lineRadial()
  .curve(d3["curveCardinalClosed"])
  .radius((d, i) => rScale[i](d))
  .angle((d, i) => i * angleSlice)

var angleSlice = Math.PI * 2 / axesLength

var colors = ["#2c3e50","#85c1e9","#717d7e", "#1b4f72", "#922b21","#ca6f1e"]

var rScale = maxValues.map(el => d3.scaleLinear().domain([0, el]).range([0, radius]))

var maxValues = function(){
  
  let new_vals = [];
  for(var i=0; i<data[0].length; i++){
    new_vals.push(d3.max(data.map(d => d[i].value)));
  }
  return new_vals;
}


