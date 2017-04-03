"use strict";

console.log("FieldJournalDetailedPicModalCtrl.js is connected");

app.controller("FieldJournalDetailedPicModalCtrl", function($scope, $timeout, $uibModalInstance, fieldJournalEntry, currentLocation, fieldJournalGooglePlacesRequest, fbRef, TastingWheelFactory, fieldJournalWheel, slider, location) {
	console.log("FieldJournalDetailedPicModalCtrl.js is working, and here is my entry: ", fieldJournalEntry);
	let s = $scope;

	// scope set within GooglePlacesRequest
	/*
		s.showRequests = false;
		s.searchPrediction = false;
		s.predictions = googleMapsRequestObj.data.predictions;
		s.newFieldJournalPopup = "../../partials/BootstrapTemplates/NewFieldJournalPopup.html";						
	  s.searchPrediction = true;	
	*/

	s.entry = fieldJournalEntry;
	s.editedEntry = {};
	s.modalView = "../../partials/DetailedPicModal/DetailedPicView.html";
	s.oneAtATime = true;
	s.status = {    
    isFirstOpen: true,
    isFirstDisabled: false
  };
  s.editPages = {
  	step1: '../../partials/EditDrinkEntry/EditStep1.html',
  	step2: '../../partials/EditDrinkEntry/EditStep2.html',
  	step3: '../../partials/EditDrinkEntry/EditStep3.html',
  	step4: '../../partials/EditDrinkEntry/EditStep4.html'
  };

  s.drinkLocationInput = '';
  s.myLocation = currentLocation;
  s.newFieldJournalPopup = "../../partials/BootstrapTemplates/NewFieldJournalPopup.html";
  s.editedSenses = [];
  s.slider1 = slider;
  s.location = location;
  s.drinkTypes = ['Espresso', 'Drip', 'Cold Brew'];

  s.editCropper = {};
  s.editCropper.sourceImage = null;
  s.editCropper.croppedImage = null;
  s.editBounds = {};
  s.editBounds.left = 0;
  s.editBounds.right = 0;
  s.editBounds.top = 0;
  s.editBounds.bottom = 0;




	s.changeView = (partial) => s.modalView = `../../partials/DetailedPicModal/${partial}`;
	s.resetEditedEntry = (step) => {
		s.editedEntry = {};	
		s.editedEntry.user_rating = s.entry.user_rating;	
		console.log("I am working: ");
		if (step && step === 'Step2') {
			$timeout(function() {
				TastingWheelFactory.createWheel('editViewTastingWheel');				
			}, 100); 	
		}
	};

	s.updateEntry = (step) => {
		console.log("I am about to update firebase with this entry: ", s.editedEntry);
		console.log("Here are your keys: ", Object.keys(s.editedEntry));
		console.log("Here is the original: ", s.entry);
		let key = s.entry.uglyId,
				updates = {},
				editedProps = Object.keys(s.editedEntry);

		editedProps.forEach((prop) => {
			s.entry[prop] = s.editedEntry[prop];
		});
		if (editedProps.length === 0) return;
		if (step === 'Step4') {
			if (s.editCropper.croppedImage !== null) {
			 s.entry.drink_image = s.editCropper.croppedImage;				
			} else { return; }
		}
		delete s.entry.uglyId;
		delete s.entry['$$hashKey'];
		updates[`/fieldJournal/${key}`] = s.entry;
		fbRef.database().ref().update(updates);
		fbRef.database().ref(`fieldJournal/${key}`).once('value').then(
				(snapshot) => {
					s.entry = snapshot.val();
					s.entry.uglyId = key;
					console.log("Here is your updated entry: ", s.entry);
				}
			);		
	};

	s.deleteEntry = () => {
		console.log("Im supposed to delete something huh?");
		fbRef.database().ref().child(`fieldJournal/${s.entry.uglyId}`).remove().then(
				() => {
					s.$apply();
					$uibModalInstance.dismiss('cancel');					
				}
			);
	};

	s.GooglePlacesRequest = (searchRequest) => {
		s.showRequests = false;
		s.predictions = [];
		fieldJournalGooglePlacesRequest(searchRequest).then(
				(mySearchResults) => {
					console.log("Here are my results: ", mySearchResults);
					s.searchPrediction = mySearchResults.searchPrediction;
					s.predictions = mySearchResults.predictions;
					s.$apply();
				}
			);
	};

	s.showMeSomething = (input) => console.log(input);

	s.logSelectedLocation = (mySelectedLocation) => {
		$("#newDrinkLocation").val(mySelectedLocation.description);
		s.searchPrediction = false;
		s.predictions = null;
		console.log(mySelectedLocation);
		var service = new google.maps.places.PlacesService(document.createElement('div'));

		service.getDetails({placeId: mySelectedLocation.place_id}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("Here is my selected place; ", place);                
        s.editedEntry.place_id = place.place_id;
        s.editedEntry.google_rating = place.rating;
        s.editedEntry.location_title = place.name;
        s.editedEntry.location_address = place.formatted_address;
        s.editedEntry.location_phone_number = place.formatted_phone_number;
        s.editedEntry.lat = place.geometry.location.lat();
        s.editedEntry.lng = place.geometry.location.lng();                                        
        s.editedEntry.store_hours = {}; 
        if (place.opening_hours) {
	        let storeHours = place.opening_hours.weekday_text;
	        storeHours.forEach((day) => {
	        	console.log(day);
	        	let myDay = {},
	        			separator = day.indexOf(':'),
	        			dayName = day.slice(0, separator),
	        			dayHours = day.slice(separator+2, day.length);

	        	s.editedEntry.store_hours[dayName] = dayHours;
	        });        	
        }       
        console.log(s.editedEntry);   
        s.$apply();
    	}
    });
	};

	s.changeStep = (step) => {
		s.selectedStep = step.partial;
		if (step.name === 'Hone in Your Senses') {
			$timeout(function() {
				TastingWheelFactory.createWheel();				
			}, 100); 			
		}		
	};

	s.$watch(
		function() { return fieldJournalWheel.Sense; },
		function(newValue, oldValue) {
			console.log("Your shit is changinnn");
			if (s.editedSenses.indexOf(newValue) !== -1 || typeof newValue !== "string" || newValue === "Tasting Wheel") return;			
			s.editedSenses.push(newValue);			
			s.editedEntry.senses = s.editedSenses.join(' ');
			console.log("Here are your user's senses: ", s.editedEntry.senses);
		});	

	s.removeEditedSense = (sense) => {
		let findSense = (someSense) => someSense != sense;		
		s.editedSenses = s.editedSenses.filter(findSense);
		s.editedEntry.senses = s.editedSenses.join(' ');
		console.log("Here are your user's editedSenses: ", s.editedEntry.senses);
	};
	

});





