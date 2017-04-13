"use strict";


app.controller("FieldJournalDetailedPicModalCtrl", function($scope, $timeout, $uibModalInstance, fieldJournalEntry, currentLocation, fieldJournalGooglePlacesRequest, fbRef, TastingWheelFactory, fieldJournalWheel, slider, pageLocation, logSelectedLocation) {	
	let s = $scope;
	s.name = 'FieldJournalDetailedPicModalCtrl';

	//Set up initial scope variables	
	s.entry = fieldJournalEntry;
	s.editedEntry = {};
	//This can get injected if you are on your personal list of entries
	s.modalView = "../../partials/DetailedPicModal/DetailedPicView.html";
	s.oneAtATime = true;
	//This is to enable open and close features on the accordion view for editing
	s.status = {    
    isFirstOpen: true,
    isFirstDisabled: false
  };  

  s.drinkLocationInput = '';
  s.myLocation = currentLocation;
  s.newFieldJournalPopup = '../../partials/BootstrapTemplates/NewFieldJournalPopup.html';
  //array to hold all of your senses
  s.editedSenses = [];
  //initialize your slider obj
  s.slider1 = slider;
  //gets changed if you want to edit one of your entries
  s.location = pageLocation;
  s.drinkTypes = ['Espresso', 'Drip', 'Cold Brew'];

  //setup cropper obj for editing images
  s.editCropper = {};
  s.editCropper.sourceImage = null;
  s.editCropper.croppedImage = null;
  s.editBounds = {};
  s.editBounds.left = 0;
  s.editBounds.right = 0;
  s.editBounds.top = 0;
  s.editBounds.bottom = 0;

  s.logSelectedLocation = logSelectedLocation;

  //switch between editing an entry and just viewing an entry
	s.changeView = (partial) => s.modalView = `../../partials/DetailedPicModal/${partial}`;

	//resets your entry so that excess data doesnt show up on your screen
	s.resetEditedEntry = (step) => {
		s.editedEntry = {};	
		s.editedEntry.user_rating = s.entry.user_rating;			
		if (step && step === 'Step2') {
			//clear and reset the tasting wheel when you go to the hone in your senses edit
			$("#editViewTastingWheel").empty();
			$timeout(() => { TastingWheelFactory.createWheel('editViewTastingWheel');	}, 100); 	
		}
	};

	//makes a call to firebase to update your edited entry
	s.updateEntry = (step) => {
		//grab your key, instantiate your updates obj, and grab all properties that have been edited
		let key = s.entry.uglyId,
				updates = {},
				editedProps = Object.keys(s.editedEntry);
		//if no properties have been edited, return
		if (editedProps.length === 0) return;
		if (step === 'Step4') {
			if (s.editCropper.croppedImage !== null) {
			 s.entry.drink_image = s.editCropper.croppedImage;				
			} else { return; }
		}
		//for each edited property, set it to s.entry		
		editedProps.forEach((prop) => s.entry[prop] = s.editedEntry[prop] );		
		//delete uglyId and $$hashkey 
		delete s.entry.uglyId;
		delete s.entry['$$hashKey'];
		//create your update obj to be sent to firebase
		updates[`/fieldJournal/${key}`] = s.entry;
		//update it
		fbRef.database().ref().update(updates).then(
				//then get the updated value and reset your entry
				() => {
					fbRef.database().ref(`fieldJournal/${key}`).once('value').then(
							(snapshot) => {
								s.entry = snapshot.val();
								s.entry.uglyId = key;								
							}
						);		
				}
			);
	};

	//removes your entry from firebase
	s.deleteEntry = () => {		
		fbRef.database().ref().child(`fieldJournal/${s.entry.uglyId}`).remove().then(
				() => {
					s.$apply();
					$uibModalInstance.dismiss('cancel');					
				}
			);
	};

	//make a google maps request for seaching specific locations within your edit
	s.GooglePlacesRequest = (searchRequest) => {
		s.showRequests = false;
		s.predictions = [];
		//make a request to google maps places library for specific predictions on a given input
		fieldJournalGooglePlacesRequest(searchRequest).then(
				(mySearchResults) => {					
					//update predictions
					s.searchPrediction = mySearchResults.searchPrediction;
					s.predictions = mySearchResults.predictions;
					s.$apply();
				}
			);
	};
	
	//updates a bunch of location information, this is done in HomeCtrl.js
	s.udateLocationEntry = (selectedLocation) => {
		s.searchPrediction = false;
    s.predictions = null; 
    //Update a bunch of location info  
		s.logSelectedLocation(selectedLocation).then(
				(updates) => {
					//for each edited piece, add that property to s.editedEntry
					Object.keys(updates).forEach((update) => {
						s.editedEntry[update] = updates[update];
					});	
					$timeout(() => return );				
				}
			);
	};

	//This is a watch for your edited senses
	s.$watch(
		function() { return fieldJournalWheel.Sense; },
		function(newValue, oldValue) {			
			if (s.editedSenses.indexOf(newValue) !== -1 || typeof newValue !== "string" || newValue === "Tasting Wheel") return;			
			s.editedSenses.push(newValue);			
			s.editedEntry.senses = s.editedSenses.join(' ');			
		});	

	//This removes senses
	s.removeEditedSense = (sense) => {
		//set up a filter function
		let findSense = (someSense) => someSense != sense;		
		s.editedSenses = s.editedSenses.filter(findSense);
		//join your array of senses to a single string
		s.editedEntry.senses = s.editedSenses.join(' ');		
	};
	

});





