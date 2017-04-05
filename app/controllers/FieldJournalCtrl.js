"use strict";

/*

	This control has total control over the NewFieldJournal as well as 
	ListFieldJournal partials. 
*/


console.log("FieldJournalCtrl.js is connected");

app.controller("FieldJournalCtrl", function($scope, $state, $timeout, $uibModal, pages, UserStorageFactory, HandleFBDataFactory, fbRef, GoogleMapsFactory, TastingWheelFactory, fieldJournalWheel) {
	let s = $scope;
	let request;
	console.log("FieldJournalCtrl.js is working");	
	console.log("Here is your currentUser fom within FieldJournalCtrl.js: ", s.currentUser);
	s.pages = pages;
	s.category = 'Coffee';
	s.drinkTypes = ['Espresso', 'Drip', 'Cold Brew'];
	s.tabs = [
		{
			name: 'Date Created',
			model: 'entry_created',
			number: true
		},
		{	
			name: 'Title',
			model: 'review_title',
			number: false			
		},
		{
			name: 'Location',
			model: 'location_title',
			number: false		
		},
		{
			name: 'Rating',
			model: 'user_rating',
			number: true			
		}
	];
	s.saveEdit = true;
	s.senses = [];
	s.oneAtATime = true;
	s.dummyView = '../../partials/NewDrinkEntry/DummyView.html';
	s.steps = [
		{
			name: 'The Basics',
			partial: '../../partials/NewDrinkEntry/Step1.html'
		},
		{
			name: 'Hone in Your Senses',
			partial: '../../partials/NewDrinkEntry/Step2.html'
		},
		{
			name: 'Status / Rating',
			partial: '../../partials/NewDrinkEntry/Step3.html'
		},
		{
			name: 'Picture Time',
			partial: '../../partials/NewDrinkEntry/Step4.html'
		}
	];

	s.newDrink = {										//This obj is created to be sent to /fieldJournal collection within firebase
																		//It should be referenced by uid

	  user_senses: '',
		uid: '', 			//to search for the user's field notes
		place_id: '',										//selected_prediction.place_id
		user_rating: '',								//based on user
		google_rating: '',							//second_call_obj.rating
		date_created: Date.now(),				//field journal entry creation
		review_title: '',								//user's review title
		location_title: '',							//selected_prediction.terms[0]
		location_address: '',						//second_call_obj.formatted_address
		location_phone_number: '',			//second_call_obj.formatted_phone_number
		category: s.category,						//Coffee, Wine, etc
		review_description: '',					//user's review
		lat: '',												//second_call_obj.geometry.location.lat()
		lng: '',												//second_call_obj.geometry.location.lng()
		store_hours: {}									/*
																			second_call_obj.opening_hours.weekday_text = [strings of each days hours]
																			let days = {};
																			^.forEach((day) => {
																				let myDay = {};
																				let separator = ^[day].indexOf(':');
																				let day_name = ^[day].slice(0, separator);
																				let day_hours = ^[day].slice(separator+1, ^[day].length);
																				days[day_name] = day_hours;

																				days =
																						{
																							'Monday': '7:00 AM – 7:00 PM',
																							'Tuesday': 'etc'
																						}
																			})
																		*/		
	};
	s.newDrink = {
		user_rating: 0
	};	


	s.fieldJournal = [];
	s.drinkForm = `partials/drink-forms/${s.category}Form.html`;
	s.subPage = 'listFieldJournal';
	s.fieldJournalListPicDetails = "../partials/FieldJournalListPicDetails.html";
	s.entry = {};

	s.coffeeStyles = ['Latte', 'Macchiato', 'Cortado', 'Flat White', 'Espresso', 'Cappucino'];
	s.coffeeMethods = ['Drip', 'French Press', 'Cold Brew'];	  


	//==================================
	//This is for step4 img cropping
	s.cropper = {};
  s.cropper.sourceImage = null;
  s.cropper.croppedImage   = null;
  s.bounds = {};
  s.bounds.left = 0;
  s.bounds.right = 0;
  s.bounds.top = 0;
  s.bounds.bottom = 0;
	s.showPicture = () => console.log(s.cropper); console.log(s.bounds);

	//==================================

	let updateCurrentFieldJournal = () => {

		fbRef.database().ref('fieldJournal').orderByChild('uid').equalTo(s.currentUser.uid).once('value').then(
				(snapshot) => {
					let fieldJournals = snapshot.val();
					console.log("Here is your firebase version of the update: ", fieldJournals);
					s.fieldJournal = [];
					for (var fieldJournalEntry in fieldJournals) {
						console.log(fieldJournalEntry);
						fieldJournals[fieldJournalEntry].uglyId = fieldJournalEntry;
						s.fieldJournal.unshift(fieldJournals[fieldJournalEntry]);					
					}		
					console.log("Here is your field journal: ", s.fieldJournal);
					UserStorageFactory.setCurrentFieldJournal(s.fieldJournal);
					s.$apply();
				}
			);		
	};
	updateCurrentFieldJournal();	

	var fieldNotesRef = fbRef.database().ref('fieldJournal/');
	fieldNotesRef.on('value', function(snapshot) { updateCurrentFieldJournal(); });

	s.slider1 = {			
		options: {
			floor: 0,
			ceil: 5,
			step: 0.1,
			precision: 1,
			showSelectionBar: true,	    
		}
	};


	s.picDetailsDisplay = (index) => {
		s.displayDetails = index;		
		$('.img-frame-' + index).fadeTo('fast', 0.3).css('background-color', '#000');
		$('.list-field-journal-pics-img-' + index).fadeTo('fast', 0.5);
	};
	s.removeDetailsDisplay = (index) => {
		s.displayDetails = -1;
		$('.img-frame-' + index).fadeTo('fast', 1).css('background-color', '');
		$('.list-field-journal-pics-img-' + index).fadeTo('fast', 1);
	};
	s.updateTastingWheel = (event) => console.log(event);			
	s.logD = (dElement) => console.log(dElement);
	s.getCurrentLocation = () => s.myLocation = UserStorageFactory.getUserCurrentLocation(); 		
	s.changeViews = (myString) => {
		if (myString === 'listFieldJournal') {
			s.cropper.croppedImage = null;
		}
		s.newDrink = {
			user_rating: 0
		};	
		s.subPage = myString;	
	};
	s.updateEntry = (myDrinkEntry) => s.entry = myDrinkEntry;			

	s.changeStep = (step) => {
		s.selectedStep = step.partial;
		if (step.name === 'Hone in Your Senses') {
			$timeout(function() {
				TastingWheelFactory.createWheel('tastingWheel');				
			}, 100); 			
		}		
	};
	
	//Sense don't update if this isnt here
	s.checkForSenses = (event) => {
		// console.log("FieldJournalCtrl.js: ", event.target);		
	};

	s.removeSense = (sense) => {
		let findSense = (someSense) => someSense != sense;		
		s.senses = s.senses.filter(findSense);
		s.user_senses = s.senses.join(' ');
		console.log("Here are your user's senses: ", s.user_senses);
	};

	s.$watch(
		function() { return fieldJournalWheel.Sense; },
		function(newValue, oldValue) {
			console.log("Your shit is changinnn");
			if (s.senses.indexOf(newValue) !== -1 || typeof newValue !== "string" || newValue === "Tasting Wheel") return;			
			s.senses.push(newValue);			
			s.user_senses = s.senses.join(' ');
			console.log("Here are your user's senses: ", s.user_senses);
		});	

	s.logSelectedLocation = (mySelectedLocation) => {
		$("#newDrinkLocation").val(mySelectedLocation.description);
		s.searchPrediction = false;
		s.predictions = null;
		console.log(mySelectedLocation);
		var service = new google.maps.places.PlacesService(document.createElement('div'));

		service.getDetails({placeId: mySelectedLocation.place_id}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("Here is my selected place; ", place);
        s.newDrink.category = s.category;
        s.newDrink.entry_created = Date.now();
        s.newDrink.place_id = place.place_id;
        s.newDrink.google_rating = place.rating;
        s.newDrink.location_title = place.name;
        s.newDrink.location_address = place.formatted_address;
        s.newDrink.location_phone_number = place.formatted_phone_number;
        s.newDrink.lat = place.geometry.location.lat();
        s.newDrink.lng = place.geometry.location.lng();
        s.newDrink.uid = s.currentUser.uid;
        s.newDrink.user_name = s.currentUser.userName;
        s.newDrink.first_name = s.currentUser.firstName;
        s.newDrink.last_name = s.currentUser.lastName;        
        s.newDrink.store_hours = {};
        s.newDrink.profile_picture = s.currentUser.profile_picture;
        let storeHours = place.opening_hours.weekday_text;
        storeHours.forEach((day) => {
        	console.log(day);
        	let myDay = {},
        			separator = day.indexOf(':'),
        			dayName = day.slice(0, separator),
        			dayHours = day.slice(separator+2, day.length);

        	s.newDrink.store_hours[dayName] = dayHours;
        });

        console.log(s.newDrink);        
        s.$apply();
    	}
    });
	};

	s.GooglePlacesRequest = (placesSearchInput) => {
		return new Promise ((resolve, reject) => {
			$timeout.cancel(request);
			s.showRequests = false;
			s.searchPrediction = false;
			request = $timeout(function() {

				//s.location is updated on focus of the input field			
				console.log("I am about to make a request");
				console.log("Here is my current location: ", s.myLocation);
				let latLng = {
					lat: s.myLocation.lat,
					lng: s.myLocation.lng
				};
				if(!placesSearchInput) return;
				GoogleMapsFactory.GoogleMapsAutoComplete(placesSearchInput.toLowerCase(), latLng).then(
						(googleMapsRequestObj) => {
							console.log(googleMapsRequestObj.data);
							s.predictions = googleMapsRequestObj.data.predictions;
							console.log($("#newDrinkLocation").val());						
							s.newFieldJournalPopup = "../../partials/BootstrapTemplates/NewFieldJournalPopup.html";						
						  s.searchPrediction = true;	
						  let myReturnObj = {
						  	predictions: googleMapsRequestObj.data.predictions,
						  	searchPrediction: true
						  };
						  resolve(myReturnObj); 									
						}
					);					
			}, 500);
		});
	};



	//==============================================
	//Anything Firebase

	s.saveEditedEntry = (myEditedDrink) => {
		console.log(myEditedDrink);
		console.log(s.newDrink);

		if (!($("#newDrinkLocation").val())) {
			$("#newDrinkLocation").css("border", "1px solid red").attr("placeholder", "please enter new location!!");
			return;
		} else {			
			for (var entry in s.newDrink) {
				myEditedDrink[entry] = s.newDrink[entry];
			}		
			console.log("Here is myEditedDrink obj: ", myEditedDrink);
			let fieldJournalUglyId = myEditedDrink.uglyId;
			delete myEditedDrink.uglyID;
			if (myEditedDrink.$$hashKey) delete myEditedDrink.$$hashKey;
			fbRef.database().ref('fieldJournal/' + fieldJournalUglyId).set(myEditedDrink).then(
					(snapshot) => $state.reload()
				);		
		} 

	};

	s.newFieldJournalEntry = () => {
		if (s.cropper.croppedImage) s.newDrink.drink_image = s.cropper.croppedImage;		
		s.newDrink.senses = s.senses.join(", ");

		//get a reference to a new key from the location you're wanting to push to 			
		var newKey = fbRef.database().ref().child("fieldJournal").push().key,
				updates = {};

		// if (createdObj.drink_image) delete createdObj.drink_image;
	  updates['/fieldJournal/' + newKey] = s.newDrink;
	  fbRef.database().ref().update(updates);
	  fbRef.database().ref('fieldJournal/' + newKey).once('value').then(
	  		(snapshot) => {
					updateCurrentFieldJournal();
					s.subPage = 'listFieldJournal';					  			
	  		}
	  	);		
	};

	s.deleteFieldJournalEntry = () => {
		fbRef.database().ref(`fieldJournal/${s.entry.uglyId}`).remove();			
		$state.reload();
	};

	s.openMapModal = (selectedCoords) => {
		console.log("Here are your selected coords: ", selectedCoords);	
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'drinkingBuddies-modal-title',
      ariaDescribedBy: 'drinkingBuddies-modal-body',
      templateUrl: '../../partials/DrinkingBuddiesMapModal.html',      
      controller: 'DrinkingBuddiesMapModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".fieldJournal-modal-parent"),  
      resolve: {
      	locationCoordsPlaceId: function() {      		
      		return selectedCoords;
      	},
      	currentLocationCoords: function() {
      		let lat = UserStorageFactory.getUserCurrentLocation().lat,
      				lng = UserStorageFactory.getUserCurrentLocation().lng,
      				currentLocation = {
      					lat, lng
      				};
      		return currentLocation;
      	}
      }
    });

    modalInstance.result.then(function (selectedItem) {
      s.selected = selectedItem;
    }, function () {
      console.log("Dismissed");
    }); 
  };

  s.detailedPicModal = (entry, event) => {
		
  	if ($(event.target).hasClass('fieldJournal-pic-detail-location-btn')) return;

    var modalInstance = $uibModal.open({
      animation: true,      
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/FieldJournalDetailedPicModal.html',      
      controller: 'FieldJournalDetailedPicModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".fieldJournal-modal-parent"),  
      resolve: {
      	fieldJournalEntry: function() {      		
      		return entry;
      	},
      	currentLocation: function() {
      		return s.currentLocation;
      	},
      	fieldJournalGooglePlacesRequest: function() {
      		return s.GooglePlacesRequest;
      	},
      	slider: function() {
      		return s.slider1;
      	},
      	location: function() {
      		return true;
      	}
      }
    }); 

    modalInstance.result.then(function (selectedItem) {
      s.selected = selectedItem;
    }, function () {
      console.log("Dismissed");
    });
	};

});
