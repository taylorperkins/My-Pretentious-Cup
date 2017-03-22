"use strict";

app.factory("TransferDataFactory", function() {
	console.log("TransferDataFactory.js is working");

	let Coords = {};
	let drinkingBuddiesCoords = (selectedCoords) => {
		Coords = selectedCoords; 		
		console.log("Here are your coords from within TransferDataFactory.js: ", Coords);
	};

	return {
		drinkingBuddiesCoords,
		Coords
	};
	
});
