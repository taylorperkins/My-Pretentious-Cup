"use strict";

console.log("TastingWheelFactory.js is connected");

app.factory("TastingWheelFactory", function($http) {
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

		// //Here we are setting up general layouts for the sunburst
		// var margin = {top: 30, right: 10, bottom: 20, left: 10},
		// 		width = 636 - margin.left - margin.right,
		// 		height = 476 - margin.top	- margin.bottom,
		// 		radius = Math.min(width, height) / 2;
		// console.log("My dimensions: ", margin, width, height, radius);

		// //Now we are defining the scales that will turn into 
		// //visualization properties. 
		// //'x' scale will represent angular position within the visualization
		// //and ranges linearly between 0 and 2PI
		// //'y' scale will will represent the area, so it will range between 
		// //0 to the full radius of the Visualization
		// //The area varies in the square of the radius, so this scale 
		// //takes the square root of the input domain before mapping to the output
		// //range
		// var x = d3.scaleLinear()
		// 			.range([0, 2 * Math.PI]);
		// var y = d3.scaleLinear()
		// 			.range([0, radius]);
		// console.log("Setting up x and y coords: ", x, y);

		// //d3 attributes
		// var formatNumber = d3.format(",d");
		// var color = d3.scaleOrdinal(d3.schemeCategory20);
		// var partition = d3.partition();
		// console.log("Here are your d3 attributes: ", formatNumber, color, partition);

		// //Setting up the arc of the circle
		// var arc = d3.arc()
		// 			.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		// 			.endAngle(function(d) 	{ return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		// 			.innerRadius(function(d){ return Math.max(0, y(d.y0)); })
		// 			.outerRadius(function(d){ return Math.max(0, y(d.y1)); });
		// console.log("This should be your arc: ", arc);

		// //Create the element to append our data to. This will be our container
		// //for visualization.
		// //The svg element contains a "<g>" element that can be transformed
		// //through translation to account for margins and such		
		// var svg = d3.select("body").append("svg")
		// 			.attr("width", width + margin.left + margin.right)
		// 			.attr("height", height + margin.top + margin.bottom)
		// 		.append("g")
		// 			.attr("transform", "translate(" +
		// 							(margin.left + width / 2) + "," +
		// 							(margin.top + height / 2) + ")");
		// console.log("My svg element: ", document.getElementsByTagName("svg"));

		var width = 960,
		    height = 700,
		    radius = (Math.min(width, height) / 2) - 10;

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


		var svg = d3.select("body").append("svg")
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
		      .attr("d", arc)
		      .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
		      .on("click", click)
		    .append("title")
		      .text(function(d) { return d.data.name; });
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
