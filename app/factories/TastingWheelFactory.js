"use strict";

app.factory("TastingWheelFactory", function($http, fieldJournalWheel) {
	
	//creds --> https://bl.ocks.org/maybelinot/5552606564ef37b5de7e47ed2b7dc099
	let createWheel = (whereToAppend) => {				

		var width = 294.16,
		    height = 294.16,
		    radius = (Math.min(width, height) / 2 - 10),

				formatNumber = d3.format(",d"),

				x = d3.scaleLinear()
		    	.range([0, 2 * Math.PI]),
				y = d3.scaleSqrt()
		    .range([0, radius]),

			  color = d3.scaleOrdinal(d3.schemeCategory20),

				partition = d3.partition(),

				arc = d3.arc()
		    	.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		    	.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		    	.innerRadius(function(d) { return Math.max(0, y(d.y0)); })
		    	.outerRadius(function(d) { return Math.max(0, y(d.y1)); }),

				div = d3.select(`#${whereToAppend}`).append("div")
					.attr("class", "tooltip")				
    			.style("opacity", 0),

				svg = d3.select(`#${whereToAppend}`).append("svg")
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
		createWheel
	};
	
});
