"use strict";

console.log("GlobeViewCtrl.js is connected");

app.controller("GlobeViewCtrl", function($scope, $http, $sce, $window, $timeout, GoogleMapsFactory, GoogleMapsConfig) {
	let s = $scope;
	let request;

	s.GooglePlacesRequest = (inputValue) => {		
		$timeout.cancel(request);
		s.showRequests = false;
		request = $timeout(function() {

			console.log("I am about to make a request");
			console.log("Here is my current location: ", s.myLocation);
			let latLng = {
				lat: s.myLocation.lat(),
				lng: s.myLocation.lng()
			};
			GoogleMapsFactory.GoogleMapsAutoComplete(inputValue, latLng).then(
					(googleMapsRequestObj) => {
						console.log(googleMapsRequestObj.data);
						s.predictions = googleMapsRequestObj.data.predictions;
						s.showRequests = true;
						return;
					}
				);					
		}, 500);
	};

	s.displayCoord = (selectedPrediction) => {
		console.log(selectedPrediction);
		s.showRequests = false;
		$( "#globe-input" ).val(selectedPrediction.description);

		var infowindow = new google.maps.InfoWindow();
		let service = new google.maps.places.PlacesService(s.map);

		service.getDetails({
        placeId: selectedPrediction.place_id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
            map: s.map,
            position: place.geometry.location
        });
        console.log("Here is your search coords: ", place.geometry.location);
        console.log("Lat: ", place.geometry.location.lat());
        console.log("Lat: ", place.geometry.location.lng());
        console.log("=============================");
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(s.map, this);
        });
      }
    });
	};


	//This function is for handling page markers whenever a text input is searched
	s.handleRequests = (results, status) => {
		console.log(results);
		GoogleMapsFactory.createMarkerContent(results, status).then(
				(markersArr) => {
    			markersArr.forEach((marker) => {

					  let infowindow = new google.maps.InfoWindow({
					    content: marker.contentString
					  });

					  let currentMarker = new google.maps.Marker({
					    position: marker.myLatLng,
					    map: s.map,
					    title: `${marker.mySearch.name}`
					  });		
					 
					  currentMarker.addListener('click', function() {
					    infowindow.open(s.map, currentMarker);
					    console.log(marker);		    				
    				});
				  });						  	    				
		});
	};			
						
  $window.navigator.geolocation.getCurrentPosition(function(position) {	   

  	s.myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);	    	
  	console.log("Here is my location: ", s.myLocation);

  	//create a map based off of my location
  	s.map = new google.maps.Map(document.getElementById("map"), {
  		center: s.myLocation,
  		zoom: 15
  	}); 
  	
  	//create a custom request based off of my current location
  	var request = {
	    location: s.myLocation,
	    radius: '2500',
	    types: ['bar', 'cafe', 'liquor_store', 'night_club', 'university']
	  };

	  //Create the specific search based off of my current location
	  s.service = new google.maps.places.PlacesService(s.map);
	  s.service.textSearch(request, s.handleRequests);

	  //Set up a pop-up for my current location
    var infoWindow = new google.maps.InfoWindow({map: s.map});
    infoWindow.setPosition(s.myLocation);
    infoWindow.setContent('You are here.');	        
  });			 
		
});



