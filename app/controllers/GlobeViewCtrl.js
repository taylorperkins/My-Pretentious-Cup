"use strict";

console.log("GlobeViewCtrl.js is connected");

app.controller("GlobeViewCtrl", function($scope, $http, $sce, $timeout,GoogleMapsFactory ) {
	let s = $scope;

	

	var globeInput = $( "#globe-input" );

	GoogleMapsFactory.GoogleMapsRequest();

		// console.log("I am active");
  //   navigator.geolocation.getCurrentPosition((location) => {
  //   	console.log(location);
  //   	s.lat = location.coords.latitude;
  //   	s.lng = location.coords.longitude;	
	 //    var latlng = new google.maps.LatLng(s.lat, s.lng);
	 //    var myOptions = {
  //       zoom: 13,
  //       center: latlng,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
	 //    };

	 //    s.map = new google.maps.Map(document.getElementById("map"), myOptions); 
	 //    s.marker = new google.maps.Marker({
  //       position: {lat: s.lat, lng: s.lng},
  //       map: s.map,
  //       title: 'I am here!'
  //     });


  //     var defaultBounds = new google.maps.LatLngBounds(
		// 	   new google.maps.LatLng(-33.8902, 151.1759),
  // 			 new google.maps.LatLng(-33.8474, 151.2631));


		// 	var input = $('#globe-input');
		// 	var options = {
		// 	  bounds: defaultBounds,
		// 	  types: ['bar', 'cafe', 'liquor_store', 'night_club', 'restaurant', 'store', 'university']
		// 	};

		// 	autocomplete = new google.maps.places.Autocomplete(input, options);
  //     // s.autocomplete = new google.maps.places.AutoComplete(globeInput);
  //     // s.autocomplete.bindTo('bounds', map);

	 //   });

		
});





