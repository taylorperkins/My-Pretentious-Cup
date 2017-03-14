"use strict";

console.log("GlobeViewCtrl.js is connected");

app.controller("GlobeViewCtrl", function($scope, $http, GoogleMapsConfig) {
	let s = $scope;

	let mapKey = GoogleMapsConfig.apiKey;
	console.log(GoogleMapsConfig.apiKey);

	s.mapURL = `https://maps.google.com/maps/embed/v1/place?key=${mapKey}&q=Space+Needle,Seattle+WA`;


	

	// let map;

	// let initMap = function() {
	// 	map = new google.maps.Map(document.getElementById('map', {
	// 		center: {lat: -34.397, lng: 150.644},
	// 		zoom: 13
	// 	}));
	// };

	// $http.get(`https://maps.googleapis.com/maps/api/js?key=${s.mapKey}&v=3&callback${initMap}`).then(
	// 		(mapData) => {
	// 			console.log(mapData);
	// 			initMap(mapData);				
	// 		}
	// 	);

	console.log(`https://maps.google.com/maps/embed/v1/place?key=${s.mapKey}&q=Space+Needle,Seattle+WA`);


	console.log("GlobeViewCtrl.js is working");
	console.log("This should be my key: ", mapKey);
		
});