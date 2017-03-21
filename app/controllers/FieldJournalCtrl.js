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

	s.newDrink = {										//This obj is created to be sent to /fieldJournal collection within firebase
																		//It should be referenced by uid

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
		marker_color: GoogleMapsFactory.setMarkerColor(s.category),								//switch case based off of category
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
	s.newDrink = {};

	s.currentUser = () => {
		let myUser = UserStorageFactory.getCurrentUserInfo();
		return myUser[Object.keys(myUser)[0]];
	};

	s.fieldJournal = [];
	s.drinkForm = `partials/drink-forms/${s.category}Form.html`;
	s.subPage = 'newFieldJournal';
	s.entry = {};

	s.coffeeStyles = ['Latte', 'Macchiato', 'Cortado', 'Flat White', 'Espresso', 'Cappucino'];
	s.coffeeMethods = ['Drip', 'French Press', 'Cold Brew'];	  

	console.log(s.pages);

	let updateCurrentFieldJournal = () => {
		HandleFBDataFactory.getItemList('fieldJournal').then(
			(userObj) => {
				console.log("Here is your firebase obj: ", userObj);
				s.fieldJournal = [];
				for (var fieldJournalEntry in userObj) {
					console.log(fieldJournalEntry);
					userObj[fieldJournalEntry].uglyId = fieldJournalEntry;
					s.fieldJournal.push(userObj[fieldJournalEntry]);					
				}		
				console.log("Here is your field journal: ", s.fieldJournal);
				UserStorageFactory.setCurrentFieldJournal(s.fieldJournal);
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

	//Triggered whenever you click an existing note from the list view
	s.updateEntry = (myDrinkEntry) => {
		s.entry = myDrinkEntry;	
		console.log(s.entry);	
	};

	s.logSelectedLocation = (mySelectedLocation) => {
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
        s.newDrink.uid = s.currentUser().uid;
        s.newDrink.user_name = s.currentUser().userName;
        s.newDrink.first_name = s.currentUser().firstName;
        s.newDrink.last_name = s.currentUser().lastName;
        s.newDrink.marker_color = GoogleMapsFactory.setMarkerColor(s.category);
        s.newDrink.store_hours = {};
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

        $( "#field-journal-rating" ).attr("placeholder", "1-5 pls / Google's Rating: " + place.rating);
    	}
    });
	};

	s.GooglePlacesRequest = (placesSearchInput) => {
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
			if(!placesSearchInput) return;
			GoogleMapsFactory.GoogleMapsAutoComplete(placesSearchInput.toLowerCase(), latLng).then(
					(googleMapsRequestObj) => {
						console.log(googleMapsRequestObj.data);
						s.predictions = googleMapsRequestObj.data.predictions;
						console.log($("#newDrinkLocation").val());
						if ($("#newDrinkLocation").popover()) $("#newDrinkLocation").popover("destroy");
						
						$( "#newDrinkLocation" ).popover({html: true, animation: true, placement: "bottom", content: `<div id='location-popover'>${s.predictions[0].description}</div>`})
								.parent().on('click', '#location-popover', function() {
									$("#newDrinkLocation").val(s.predictions[0].description);
									$("#newDrinkLocation").popover("destroy");
									s.logSelectedLocation(s.predictions[0]);
								}); 
						$( "#newDrinkLocation" ).popover("show");
						s.showRequests = true;
						return;
					}
				);					
		}, 500);
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
		console.log("Here is your drink entry: ", s.newDrink);		
		let file = document.getElementById("new-fieldJournal-picture").files[0];
		if (file) {
			s.newDrink.drink_image = file;
		}
		HandleFBDataFactory.createNewFirebaseEntry(s.newDrink, "fieldJournal").then(
				(fieldJournalStatus) => $state.reload()
			);
	};

	s.deleteFieldJournalEntry = () => fbRef.database().ref(`fieldJournal/${s.entry.uglyId}`).remove();			

	s.showPicture = () => {
		let file = document.getElementById("new-fieldJournal-picture").files;
		console.log(file[0]);
	};

});




















