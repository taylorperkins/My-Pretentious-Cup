"use strict";

console.log("GlobeViewCtrl.js is connected");

app.controller("GlobeViewCtrl", function($scope, $http, $sce, GoogleMapsConfig) {
	

	// let s = $scope,
	// 		mapKey = GoogleMapsConfig.apiKey;
			

	// var mapOptions = {
	// 	zoom: 4, 
	// 	center: new googlempas.latlng(25,80),
	// 	mapTypeId: google.maps.MapTypeId.ROADMAP
	// };

	// s.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// s.markers = [];

	// let initMap = function() {
	// 	map = new google.maps.Map(document.getElementById('map', {
	// 		center: {lat: -34.397, lng: 150.644},
	// 		zoom: 13
	// 	}));
	// };

	// s.mapURL = $sce.trustAsResourceUrl(`https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=${initMap}`);
	// console.log(s.mapURL);
	
	// console.log("GlobeViewCtrl.js is working");
	// console.log("This should be my key: ", mapKey);
		
});