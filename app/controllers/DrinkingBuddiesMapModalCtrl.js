"use strict";



app.controller("DrinkingBuddiesMapModalCtrl", function($scope, $timeout, $uibModalInstance, fbRef, locationCoordsPlaceId, currentLocationCoords) {
	let s = $scope;

	s.locationAverageRating = '';
	s.locationDetails = {};
	s.locationFieldJournal = [];
	s.fieldJournalListPartial = '../../partials/Reusables/DrinkingBuddiesList.html';
	
	let origin = currentLocationCoords,
		myDestination = {
			lat: locationCoordsPlaceId.lat,
			lng: locationCoordsPlaceId.lng
		};

	fbRef.database().ref('fieldJournal').orderByChild('place_id').equalTo(locationCoordsPlaceId.place_id).once('value').then(
			(snapshot) => {				
				let fieldJournalEntries = snapshot.val(),
						combinedRating = 0,
						numOfRates = 0;

				for (var entry in fieldJournalEntries) {
					fieldJournalEntries[entry].uglyId = entry;
					s.locationFieldJournal.push(fieldJournalEntries[entry]);					
					if (fieldJournalEntries[entry].user_rating) {
						combinedRating += fieldJournalEntries[entry].user_rating;
						numOfRates++;						
					}
				}
				s.locationAverageRating = combinedRating / numOfRates;								
			}
		);

	//create a map on the modal		
	//set a timeout so that the partial loads before the controller
	$timeout(function() {

    s.drinkingBuddiesMap = new google.maps.Map(document.getElementById('drinkingBuddies-map'), {
      zoom: 12,
      center: {lat: origin.lat, lng: origin.lng}
    });

    let directionsService = new google.maps.DirectionsService,
  			directionsDisplay = new google.maps.DirectionsRenderer,    		  			
				service = new google.maps.places.PlacesService(s.drinkingBuddiesMap);	        

		service.getDetails({placeId: locationCoordsPlaceId.place_id}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        
        console.log("Here is your place: ", place);
        console.log("Here is your search coords: ", place.geometry.location);
        console.log("Lat: ", place.geometry.location.lat());
        console.log("Lat: ", place.geometry.location.lng());
        console.log("=============================");       
        s.locationDetails = place;
      }		
    });	

    directionsDisplay.setMap(s.drinkingBuddiesMap);	        	     									    

    directionsService.route({
      origin: {lat: origin.lat, lng: origin.lng},
      destination: {lat: myDestination.lat, lng: myDestination.lng},
      travelMode: 'DRIVING'
    }, function(response, status) {
    	console.log(response, status);
      if (status === 'OK') {
        directionsDisplay.setDirections(response);        
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });	  

    s.$apply();
      
	}, 100);		

	s.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});


