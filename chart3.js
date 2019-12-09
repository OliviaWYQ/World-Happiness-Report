
var width = 700;
var height = 300;
var padding = 100;


var svg3 = d3.select('#chart3').append('svg')
			.attr('width', width)
			.attr('height', height)


// formatting the data displayed in the tooltip
var formatValue = d3.format(".2n");

var selected_variable = 'world_happiness_score';
var selected_variable_scaled = 'world_happiness_score_scaled';


d3.csv('country_happiness.csv', function(data){
	// define some useful scales
	var radiusScale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) { return 5 }))
		.range([7, 30]);

	var scaleColor = d3.scaleSequential()
  		.domain([0, 1])
  		.interpolator(d3.interpolateMagma);;

	var xScale = d3.scaleLinear()
		.rangeRound([padding, width - padding])


	// a function to highlight points when clicked
	
	var toggleHighlight = function(d){
		
        d3.select(this)
        .style("stroke-width", 2)
		.style("stroke", "white");

		d3.select("#country").text("Country:"+d.country);
		d3.select("#happiness").text("Rank:"+parseInt(d.index+1));
		d3.select("#index").text(selected_variable+":"+d[selected_variable]);
	    
	};

	var removeHighlight = function(d){
	        
        d3.select(this)
        .style("stroke-width", 0.5)
		.style("stroke", "black");
	};

	// set domain for selected variable
	// xScale.domain(d3.extent(data, function(d) { return d[selected_variable_scaled]; }));


	function tick(){
		d3.selectAll('.circ')
			.attr('cx', function(d){return d.x})
			.attr('cy', function(d){return d.y})
	}


	var circles = svg3.selectAll('.circ')
		.data(data)
		.enter().append('circle').classed('circ', true)
		.attr('r', function(d) { return radiusScale(d.population); })
		.attr('cx', function(d){ return xScale(d[selected_variable_scaled]); })
		.attr('cy', function(){ return height/2; })
		.attr("fill", function(d) { return scaleColor(d.world_happiness_score_scaled); })
		.attr("stroke", "black")
		.attr("stroke-width", 0.5)
		.on('mouseover', toggleHighlight)
		.on("mouseout", removeHighlight);


	var simulation = d3.forceSimulation(data)
		.force('x', d3.forceX(function(d){
				return xScale(d[selected_variable_scaled])
			})
		)
		.force('y', d3.forceY(height/2).strength(0.03))
		.force('collide', d3.forceCollide(function(d) { return 10; }).strength(0.9))
		.alpha(0.01)
		.alphaTarget(0.3)
		.alphaDecay(0.1)
		.on('tick', tick)



	d3.selectAll('.d_sel').on('click', function(){

		selected_variable = this.value;
		selected_variable_scaled = this.value + '_scaled';

		simulation.force('x', d3.forceX(function(d){
			return xScale(d[selected_variable_scaled])
		}))


		switch(selected_variable) {
			case 'gdp_per_capita':
				d3.select("#less").transition().duration(800).style("opacity", 1).text("Lower GDP per capita");
				d3.select("#more").transition().duration(800).style("opacity", 1).text("Higher GDP per capita");
			break;

			case 'school_years':
				d3.select("#less").transition().duration(800).style("opacity", 1).text("Less school years");
				d3.select("#more").transition().duration(800).style("opacity", 1).text("More school years");
			break;

			case 'employment_rate':
				d3.select("#less").transition().duration(800).style("opacity", 1).text("Lower employment rate");
				d3.select("#more").transition().duration(800).style("opacity", 1).text("Higher employment rate");
			break;

			case 'health_expenditure_per_person':
				d3.select("#less").transition().duration(800).style("opacity", 1).text("Lower health expenditure");
				d3.select("#more").transition().duration(800).style("opacity", 1).text("Higher health expenditure");
		  	break;

		  	case 'government_effectiveness':
		  		d3.select("#less").transition().duration(800).style("opacity", 1).text("Lower government effectiveness");
				d3.select("#more").transition().duration(800).style("opacity", 1).text("Higher government effectiveness");
			break;
		}


	})


})
