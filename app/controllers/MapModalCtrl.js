"use strict";


app.controller("MapModalCtrl", function($scope, $timeout, $uibModalInstance, fbRef, locationCoordsPlaceId, currentLocationCoords) {
	let s = $scope;

	s.locationAverageRating = '';
	s.locationDetails = {};			
	
	//separate coords from placeid in locationCoordsPlaceId
	let myDestination = {
			lat: locationCoordsPlaceId.lat,
			lng: locationCoordsPlaceId.lng
		};

	//Get all entries related to given location
	fbRef.database().ref('fieldJournal').orderByChild('place_id').equalTo(locationCoordsPlaceId.place_id).once('value').then(
			(snapshot) => {				
				//define entries, combined rating, and num of rates
				let fieldJournalEntries = snapshot.val(),
						combinedRating = 0,
						numOfRates = 0;

				//Turn your obj of objs from your database into a list of your entries
				s.locationFieldJournal = Object.keys(fieldJournalEntries).reverse().map((entry) => {
					//If there's a rating on the entry, add it to the combined rating and ++ your numOfRates
					if (fieldJournalEntries[entry].user_rating) {
						combinedRating += fieldJournalEntries[entry].user_rating;
						numOfRates++;		
					}
					//assign uglyId prop to your entry
					fieldJournalEntries[entry].uglyId = entry;
					return fieldJournalEntries[entry];					
				});				
				//get an average rating of the store overall
				s.locationAverageRating = (combinedRating / numOfRates).toFixed(1);								
			}
		);

	//create a map on the modal		
	//set a timeout so that the partial loads before the controller
	$timeout(function() {

		//set up your initial map instance
    s.mapModal = new google.maps.Map(document.getElementById('drinkingBuddies-map'), {
      zoom: 12,
      center: {lat: currentLocationCoords.lat, lng: currentLocationCoords.lng}
    });

    //instantiate your services from google maps API
    let directionsService = new google.maps.DirectionsService,
  			directionsDisplay = new google.maps.DirectionsRenderer,    		  			
				service = new google.maps.places.PlacesService(s.mapModal);	        

		//Actually set the map
    directionsDisplay.setMap(s.mapModal);	        	     									    

		//get a more in-depth description of a your selected location
		service.getDetails({placeId: locationCoordsPlaceId.place_id}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {   
        s.locationDetails = place;
      }		
    });	

		//now get a route directly related from your current location and the location that you
		//selected. Display those directions on your map
    directionsService.route({
      origin: {lat: currentLocationCoords.lat, lng: currentLocationCoords.lng},
      destination: {lat: myDestination.lat, lng: myDestination.lng},
      travelMode: 'DRIVING'
    }, function(response, status) {    	
      if (status === 'OK') {
        directionsDisplay.setDirections(response);        
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });	  
    s.$apply();
      
	}, 100);		

	s.cancel = () => $uibModalInstance.dismiss('cancel');  

});


