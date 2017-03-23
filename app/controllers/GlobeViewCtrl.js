"use strict";

console.log("GlobeViewCtrl.js is connected");

app.controller("GlobeViewCtrl", function($scope, $http, $sce, $window, $timeout, GoogleMapsFactory, GoogleMapsConfig, UserStorageFactory, TransferDataFactory, drinkingBuddiesCoords) {
	let s = $scope;
	let request;

	//s.map is available throughout the entire page to refer to whenever creating extra pieces for the map

	//This is to keep track of all the markers on the page through each type of filer.
	s.markersOnPage = [];
	s.currentLocationMarker = [];
	s.searchResultMarkers = [];
	s.fieldJournalMarkers = [];
	s.selectedGlobeLocation = [];
	s.displayFieldJournals = false;

	let getFieldJournal = function() {
		s.fieldJournal = UserStorageFactory.getCurrentFieldJournal();
	};

	console.log("Here is your fieldJournal from GlobeViewCtrl.js: ", s.fieldJournal);

	s.$watch(
		function(){ return drinkingBuddiesCoords.Coords;}, 
		function(newValue, oldValue){
			if (newValue.lat && newValue.lng) {
				console.log("Your data has changed!");
				let currentLocation = UserStorageFactory.getUserCurrentLocation();
				let origin = {
					lat: currentLocation.lat(),
					lng: currentLocation.lng()
				};				
				console.log("destination: ", newValue, " origin: ", origin);				
				// GoogleMapsFactory.GoogleMapsDrivingDirections(origin, newValue).then(
				// 		(result) => {
				// 			console.log("Here are your directions: ", result.data);

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        s.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: origin.lat, lng: origin.lng}
        });
        $( "<div id='right-panel'></div>" ).insertAfter( "#map" );
        directionsDisplay.setMap(s.map);	        	     									
        directionsDisplay.setPanel(document.getElementById('right-panel'));

        

        directionsService.route({
          origin: {lat: origin.lat, lng: origin.lng},
          destination: {lat: newValue.lat, lng: newValue.lng},
          travelMode: 'DRIVING'
        }, function(response, status) {
        	console.log(response, status);
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });				      					
					// );
			}
		}
	);


	//As soon as the controller loads, grab the user's current location, and display an info-window 
	//showing their current location. Also, send the coords to be saved within 
	//UserStorageFactory.js to be referrenced by other controllers
	$window.navigator.geolocation.getCurrentPosition(function(position) {	   
  	s.myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);	    	
  	console.log("Here is my location: ", s.myLocation);

  	UserStorageFactory.setUserCurrentLocation(s.myLocation);

  	//create a map based off of my location
  	//This is set up as soon as the ctrl loads. 
  	//You can refer to s.map anywhere else on the page
  	s.map = new google.maps.Map(document.getElementById("map"), {
  		center: s.myLocation,
  		zoom: 15
  	});   
  	//create a custom request based off of my current location
  	var request = GoogleMapsFactory.getRequest(s.myLocation);

	  //Set up a pop-up for my current location
    var infoWindow = new google.maps.InfoWindow({map: s.map});
    infoWindow.setPosition(s.myLocation);
    infoWindow.setContent('You are here.');	


  });		

	/*
		These next few functions are designed to only clear markers from the map and also clear the designated arrays
		================================

	*/
	//Takes an array of markers and displays them on the page
	s.setMapOnAll = (map, selectedMarkersArr) => {
    for (var i = 0; i < selectedMarkersArr.length; i++) {
      selectedMarkersArr[i].setMap(map);
    }
  };

  //Removes all markers from the map while keeping them in their designated arrays
  s.clearMarkers = (mySelectedMarkersArr) => {
    s.setMapOnAll(null, mySelectedMarkersArr);
  };

  //Removes all the markers from the map, 
  //Then clears the passed array, completely removing all instances of those markers
  s.deleteMarkers = () => {  	
  	let allArrays = [s.markersOnPage, s.currentLocationMarker, s.searchResultMarkers, s.fieldJournalMarkers];
  	s.data.selectedGlobeLocation = [];
  	s.data.displayFieldJournals = false;  		  
  	allArrays.forEach((markerArr) => {
  		if (markerArr.length > 0) {
  			s.clearMarkers(markerArr);
			  markerArr = []; 
			  console.log(markerArr);
			  $( "#globe-input" ).val(''); 			  
  		}
  		$("#right-panel").remove();
  		s.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: s.myLocation.lat(), lng: s.myLocation.lng()}
      });
      var infoWindow = new google.maps.InfoWindow({map: s.map});
	    infoWindow.setPosition(s.myLocation);
	    infoWindow.setContent('You are here.');	
  	});  
  	s.$apply();	
  };

  /*
  	================================
		================================
 	*/



	//This function is called when you are typing in the input field above the map to 
	//search for any given place. This just makes the request and displays the predictions for the 
	//user to choose what they would like to view
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


	//This is called when a user chooses a prediction given by googlePlaces
	//The selected prediction object is obtained, 
	//the name is set to the val() of the input field, and a new marker is created on the map
	//The marker also has an info window for the user to open and check out the shop
	s.displayCoord = (selectedPrediction) => {
		console.log(selectedPrediction);
		s.showRequests = false;
		$( "#globe-input" ).val(selectedPrediction.description);

		var infowindow = new google.maps.InfoWindow();
		let service = new google.maps.places.PlacesService(s.map);

		service.getDetails({placeId: selectedPrediction.place_id}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
            map: s.map,
            position: place.geometry.location
        });

        //Keep Track of all markers on the page
        s.searchResultMarkers.push(marker);
        s.markersOnPage.push(marker);

        console.log("Here is your place: ", place);
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


	//This function is not currently active. 
	//The goal of this function is to take an array of markers, along with a status from 
	//Google.maps.PlacesServices to create a new marker on the map 
	//for each object in the array and display them on the page.
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

	$("#map").on("click", function(event) {
		console.log(event.target);
		if ($(event.target).hasClass("globe-field-journal")) {
			console.log("I am in an info-window!");
			console.log(s.groupBy[event.target.id]);
			s.selectedGlobeLocation = s.groupBy[event.target.id];   
			s.displayFieldJournals = true;	
			s.$apply();		  
		}
	});


	s.showFieldJournalMarkers = () => {
		getFieldJournal();
		console.log(s.fieldJournal);

		s.groupBy = function(xs, key) {
		  return xs.reduce(function(rv, x) {
		    (rv[x[key]] = rv[x[key]] || []).push(x);
		    return rv;
		  }, {});
		}(s.fieldJournal, 'place_id');
		
		let groupedFieldJournalArr = [];
		for (var place in s.groupBy) { groupedFieldJournalArr.push(s.groupBy[place]); }
					
		console.log("Here is your groupBy: ", s.groupBy);
		console.log("groupedFieldJournalArr: ", groupedFieldJournalArr);
		
		
		if (groupedFieldJournalArr.length > 0) {
			groupedFieldJournalArr.forEach((entry) => {


				let contentString = 
					`<div>${entry[0].location_title}</div>` +
					`<div id="${entry[0].place_id}" class="globe-field-journal">You have ${entry.length} reviews!!</div>`;
				let infowindow = new google.maps.InfoWindow({
			    content: contentString
			  });

				let fieldJournalMarker = new google.maps.Marker({
			    position: {lat: entry[0].lat, lng: entry[0].lng},
			    map: s.map,			    
			    icon: `http://labs.google.com/ridefinder/images/mm_20_${entry[0].marker_color}.png`
			  });	
			  fieldJournalMarker.addListener('click', function() {
			  	console.log("You clicked a marker!");
			    infowindow.open(s.map, fieldJournalMarker);			    					      
				});
				s.fieldJournalMarkers.push(fieldJournalMarker);
			});			
		} else {
			alert("You actually don't have any field Journal entries!! How about you make one and come back!");
		}

	};	

});





