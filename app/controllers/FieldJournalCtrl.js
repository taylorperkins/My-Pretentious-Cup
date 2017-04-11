"use strict";

/*

	This control has total control over the NewFieldJournal as well as 
	ListFieldJournal partials. 
*/

app.controller("FieldJournalCtrl", function($scope, $state, $timeout, $uibModal, pages, UserStorageFactory, fbRef, GoogleMapsFactory, TastingWheelFactory, fieldJournalWheel) {
	let s = $scope;			

	s.pages = pages;
	s.category = 'Coffee';
	//drink types are iterated over for radio buttons when deciding drink type in create a drink entry
	s.drinkTypes = ['Espresso', 'Drip', 'Cold Brew'];
	//These are representing my filters on listFieldJournal partial
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
	//These are different views to be injected when creating a field Journal entry
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


	// s.fieldJournal = [];
	s.drinkForm = `partials/drink-forms/${s.category}Form.html`;
	//this gets changed when you switch between list and new
	s.subPage = 'listFieldJournal';
	s.fieldJournalListPicDetails = "../partials/FieldJournalListPicDetails.html";
	//gets updated by updateEntry
	s.entry = {};	

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


	//Both of these set the css when you hover over a picture on the list all field journals section
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

	//The tasting wheel is sensitive, and needs some sort of function to even react
	s.updateTastingWheel = (event) => console.log(event);			
	//This does a rest on the different views, and changing the scope variables that are in effect.	
	s.changeViews = (myString) => {		
		//reset	s.cropper
		s.cropper.croppedImage = null;		
		//reset s.newDrink
		s.newDrink = {
			user_rating: 0
		};	
		//finally change the subpage
		s.subPage = myString;	
	};
	//updates s.entry
	s.updateEntry = (myDrinkEntry) => s.entry = myDrinkEntry;			

	//changes the partial injected to be step
	//also resets the tasting wheel if you are on the tasting wheel partial
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

	//removes senses from your newFieldJournal obj	
	s.removeSense = (sense) => {
		//create your filter function. Pass in someSense, return everything that is NOT that sense
		let findSense = (someSense) => someSense != sense;		
		//filter
		s.senses = s.senses.filter(findSense);
		//join the strings together
		s.user_senses = s.senses.join(' ');		
	};

	//Watches for changes from the tasting wheel and updates as it goes
	s.$watch(
		function() { return fieldJournalWheel.Sense; },
		function(newValue, oldValue) {			
			if (s.senses.indexOf(newValue) !== -1 || typeof newValue !== "string" || newValue === "Tasting Wheel") return;			
			//add in new sense to the s.senses
			s.senses.push(newValue);		
			//join the list together to create a str	
			s.user_senses = s.senses.join(' ');			
		});	

	//This gathers a bunch of information regarding google maps places library
	//Whenever a user selects a place from the autocomplete input, this gets caled
	s.logSelectedLocation = (mySelectedLocation) => {
		//change the value of the input field
		$("#newDrinkLocation").val(mySelectedLocation.description);
		//update scope variables
		s.searchPrediction = false;
		s.predictions = null;		
		//declare google maps places library service to get some better details on the location
		var service = new google.maps.places.PlacesService(document.createElement('div'));
		//call the service, passing in the location's coords
		service.getDetails({placeId: mySelectedLocation.place_id}, function(place, status) {
			//check status
      if (status === google.maps.places.PlacesServiceStatus.OK) {
      	//get all details related to your selected place and add them to s.newDrink                     
        s.newDrink.place_id = place.place_id;
        s.newDrink.google_rating = place.rating;
        s.newDrink.location_title = place.name;
        s.newDrink.location_address = place.formatted_address;
        s.newDrink.location_phone_number = place.formatted_phone_number;
        s.newDrink.lat = place.geometry.location.lat();
        s.newDrink.lng = place.geometry.location.lng();        
        s.newDrink.store_hours = {}; 
        //this created an obj that holds store hours for your location       
        let storeHours = place.opening_hours.weekday_text;
        storeHours.forEach((day) => {        	        	
        	let separator = day.indexOf(':'),
        			dayName = day.slice(0, separator),
        			dayHours = day.slice(separator+2, day.length);

        	s.newDrink.store_hours[dayName] = dayHours;
        });        
        s.$apply();
    	}
    });
	};	

	//==============================================
	//Anything Firebase

	//whenever you create a new fieldJournal entry	
	s.newFieldJournalEntry = () => {
		//if you upload and crop a picture, add it
		if (s.cropper.croppedImage) s.newDrink.drink_image = s.cropper.croppedImage;		
		//add extra schtuff
		s.newDrink.senses = s.senses.join(", ");
		s.newDrink.entry_created = Date.now();
		s.newDrink.uid = s.currentUser.uid;
    s.newDrink.user_name = s.currentUser.userName;
    s.newDrink.first_name = s.currentUser.firstName;
    s.newDrink.last_name = s.currentUser.lastName;        
    s.newDrink.profile_picture = s.currentUser.profile_picture;

		//get a reference to a new key from the location you're wanting to push to 			
		var newKey = fbRef.database().ref().child("fieldJournal").push().key,
				updates = {};

		// if (createdObj.drink_image) delete createdObj.drink_image;
	  updates['/fieldJournal/' + newKey] = s.newDrink;
	  //There is a watch function that listens for this user's fieldJournal collection changes and updates
	  //s.fieldJournal when it is updated
	  fbRef.database().ref().update(updates).then(
	  		() => {
					s.subPage = 'listFieldJournal';
					s.$apply();					  				  			
	  		}
	  	);	  
	};	

});
