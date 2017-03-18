"use strict";

/*

	This control has total control over the NewFieldJournal as well as 
	ListFieldJournal partials. 
*/


console.log("FieldJournalCtrl.js is connected");

app.controller("FieldJournalCtrl", function($scope, $state, $timeout, pages, UserStorageFactory, HandleFBDataFactory, fbRef, GoogleMapsFactory) {
	let s = $scope;
	let request;
	console.log("FieldJournalCtrl.js is working");	
	s.pages = pages;
	s.category = 'Coffee';
	s.saveEdit = true;

	s.newDrink = {
		title: '', 
		location: '',
		dateCreated: Date.now(),
		category: s.category, 
		rating: '', 
		remainingNotes: '',
		public: true		
	};

	s.fieldJournal = [];
	s.drinkForm = `partials/drink-forms/${s.category}Form.html`;
	s.subPage = 'newFieldJournal';
	s.entry = {};

	s.coffeeStyles = ['Latte', 'Macchiato', 'Cortado', 'Flat White', 'Espresso', 'Cappucino'];
	s.coffeeMethods = ['Drip', 'French Press', 'Cold Brew'];	  

	console.log(s.pages);

	let updateCurrentFieldJournal = () => {
		HandleFBDataFactory.getItemList().then(
			(userObj) => {
				s.fieldJournal = [];
				userObj = userObj[Object.keys(userObj)[0]];
				console.log("Here is your userObj from FieldJournalCtrl: ", userObj);
				for (var entry in userObj.fieldJournal) {
					userObj.fieldJournal[entry].uglyID = entry;
					s.fieldJournal.push(userObj.fieldJournal[entry]);					
				}				
				console.log("Here is your field journal: ", s.fieldJournal);
			});
	};
	updateCurrentFieldJournal();

	s.getCurrentLocation = () => {
		s.myLocation = UserStorageFactory.getUserCurrentLocation(); 
		console.log(s.myLocation);
	};

	s.changeViews = (myString) => {
		console.log(myString);
		s.subPage = myString;
	};

	s.updateEntry = (myDrinkEntry) => s.entry = myDrinkEntry;
	
	s.saveEditedEntry = (myEditedDrink) => {
		console.log(myEditedDrink);
		let fieldJournalLocation = myEditedDrink.uglyID;
		delete myEditedDrink.uglyID;
		HandleFBDataFactory.putItem(myEditedDrink, fieldJournalLocation).then(
				(editedStatus) => $state.reload()
			);
	};


	s.newFieldJournalEntry = () => {
		console.log("Here is your drink entry: ", s.newDrink);
		let userUID = Object.keys(UserStorageFactory.getCurrentUserInfo())[0];
		console.log(userUID);
		HandleFBDataFactory.postNewItem(s.newDrink, `users/${userUID}/fieldJournal`).then(
				(fieldJournalStatus) => $state.reload()
			);
	};

	s.deleteFieldJournalEntry = () => {		
		let userUID = Object.keys(UserStorageFactory.getCurrentUserInfo())[0];
		let locationToDelete = `users/${userUID}/fieldJournal/${s.entry.uglyID}`;
		HandleFBDataFactory.deleteItem(locationToDelete).then(
				(deletionStatus) => $state.reload()
			);
	};

	s.GooglePlacesRequest = (placesSearchInput) => {
		console.log(placesSearchInput);
		$timeout.cancel(request);
		s.showRequests = false;
		request = $timeout(function() {

			//s.location is updated on focus of the input field			
			console.log("I am about to make a request");
			console.log("Here is my current location: ", s.myLocation);
			let latLng = {
				lat: s.myLocation.lat(),
				lng: s.myLocation.lng()
			};
			GoogleMapsFactory.GoogleMapsAutoComplete(placesSearchInput, latLng).then(
					(googleMapsRequestObj) => {
						console.log(googleMapsRequestObj.data);
						s.predictions = googleMapsRequestObj.data.predictions;
						console.log($("#newDrinkLocation").val());
						if ($("#newDrinkLocation").popover()) $("#newDrinkLocation").popover("destroy");
						
						$( "#newDrinkLocation" ).popover({content: `${s.predictions[0].description}`, animation: true, placement: "bottom"}); 
						$( "#newDrinkLocation" ).popover("show");
						s.showRequests = true;
						return;
					}
				);					
		}, 500);
	};	

		
});




















