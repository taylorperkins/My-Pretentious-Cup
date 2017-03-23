"use strict";

console.log("TastingWheelFactory.js is connected");

app.factory("TastingWheelFactory", function($http, fieldJournalWheel) {
	console.log("TastingWheelFactory.js is working");


	let setUpColorWheel = (category) => {

		return new Promise((resolve, reject) => {

			d3.json(`../TastingWheels/${category}.json`, function(error, response){
					if (error) throw error;
					console.log("Here is your data: ", response);
					let tastes = response;
					let individuals = [];
					let counter = 2;

					
						var scheme = new ColorScheme;
						scheme.from_hue(counter)         // Start the scheme  
						      .scheme('triade')     // Use the 'triade' scheme, that is, colors 
						                            // selected from 3 points equidistant around 
						                            // the color wheel. 
						      .variation('soft');   // Use the 'soft' color variation 					 
						var colors = scheme.colors();					
						response.color = colors[0];
						let colorCounter = 1;

						let outerChildren = 0;

						response.children.forEach((firstLevelTaste) => {
							firstLevelTaste.color = colors[colorCounter];							
							colorCounter++;
							firstLevelTaste.children.forEach((secondLevelTaste) => {
								secondLevelTaste.color = colors[colorCounter];
								colorCounter++;
								secondLevelTaste.children.forEach((thirdLevelTaste) => {
									thirdLevelTaste.color = colors[colorCounter];
									outerChildren++;
									colorCounter++;
								});
							});
						}); 
						response.outerChildren = outerChildren;
						individuals.push(response);
						counter += 20; 
					resolve(individuals);		
					});	
		});	
	};



	//creds --> https://bl.ocks.org/maybelinot/5552606564ef37b5de7e47ed2b7dc099
	let createWheel = (myColors) => {		

		var width = 460,
		    height = 460,
		    radius = (Math.min(width, height) / 2 - 75);

		var formatNumber = d3.format(",d");

		var x = d3.scaleLinear()
		    .range([0, 2 * Math.PI]);

		var y = d3.scaleSqrt()
		    .range([0, radius]);

		var color = d3.scaleOrdinal(d3.schemeCategory20);

		var partition = d3.partition();

		var arc = d3.arc()
		    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
		    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

		var div = d3.select("#tastingWheel").append("div")
					.attr("class", "tooltip")				
    			.style("opacity", 0);

		var svg = d3.select("#tastingWheel").append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  .append("g")
		    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");



		d3.json(`../TastingWheels/Coffee.json`, function(error, root){
			 if (error) throw error;
		  
		  root = d3.hierarchy(root);
		  root.sum(function(d) { return d.size; });
		  svg.selectAll("path")		  		
		      .data(partition(root).descendants())
		    .enter().append("path")
		    	.attr("id", function(d) { return d.data.name; })
		      .attr("d", arc)		      
		      .style("stroke", "#fff")
		      .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })		      
		      .on("dblclick", function(d) {
		      	console.log(d);
		      	fieldJournalWheel.Sense = d.data.name;
		      	console.log(fieldJournalWheel);
		      })
		      .on("click", click)
		      .on("mousemove", function(d) {	
	           div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d.data.name)	
                .style("left", (d3.event.clientX - 400) + "px")		
                .style("top", (d3.event.clientY - 200) + "px");	
            })					
	        .on("mouseout", function(d) {		
	            div.transition()		
	                .duration(500)		
	                .style("opacity", 0);	
	        });      
		    	   
		});
		
		
		//set up callback function for the click events
		function click(d) {
		  svg.transition()
		      .duration(750)
		      .tween("scale", function() {
		        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
		            yd = d3.interpolate(y.domain(), [d.y0, 1]),
		            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
		        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
		      })
		    .selectAll("path")
		      .attrTween("d", function(d) { return function() { return arc(d); }; });
		}		

		d3.select(self.frameElement).style("height", height + "px");
	};


	return {
		setUpColorWheel,
		createWheel
	};
	
});
