"use strict";

app.controller("HomeCtrl", function($scope, $sce, $timeout, $state, $uibModal, $window, AuthUserFactory, GoogleMapsConfig, fbRef, isAuth, GooglePlacesAutoComplete) {
	let s = $scope,      
                request;

       
    //gets set every time you switch views
    s.background = 'main';  
    s.currentUserFieldJournal = [];  

  //config for my slider
  s.slider1 = {     
    options: {
      floor: 0,
      ceil: 5,
      step: 0.1,
      precision: 1,
      showSelectionBar: true 
    }
  };
  
  //this listens to this particular user's field journal collection within firebase and 
  //updates s.fieldJournal upon change
  fbRef.database().ref('fieldJournal/').orderByChild('uid').equalTo(isAuth.uid).on("value", function(snapshot) {    
    //val from firebase
    let  fieldJournals = snapshot.val();
    //create a new array with all of your field journal entries, also adding in the uglyID per entry
    if (fieldJournals) {
      s.fieldJournal = Object.keys(fieldJournals).reverse().map((entry) => {
        fieldJournals[entry].uglyId = entry;
        return fieldJournals[entry];
      });      
    }
  });
    
  //this function listens to the current user's user collection obj within firebase for any changes, 
  //then updates s.current user based on those changes
  fbRef.database().ref('users/').orderByChild('uid').equalTo(isAuth.uid).on("value", function(snapshot) {
    //grab snapshot from firebase
    let user = snapshot.val();
    if (user) {
      currentUser = user[Object.keys(user)[0]];
      currentUser.uglyId = Object.keys(user)[0];        
      $timeout(() => s.currentUser = currentUser );
    }      
  });	

  //a nifty little jQuery method for setting the well height within the page
	var windowHeight = window.innerHeight - 400;
	$timeout(function() {
		$(".main-row").height(windowHeight);
		$(".fieldJournal-row").height(windowHeight);
		$(".drinkingBuddies-row").height(windowHeight);		
	}, 100);

  //As soon as the controller loads, grab the user's current location, and display an info-window 
  //showing their current location. 
  //As of 5-15-16 Chrome is no longer using this service

  let geoSuccess = (pos) => {
    console.log(pos);
    let myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);       
    s.myLocation = {
      lat: myLocation.lat(),
      lng: myLocation.lng()
    };         
  };
  let geoFail = (geoErr) => console.log(geoErr);  
  
  navigator.geolocation.getCurrentPosition(geoSuccess, geoFail);   

  //this function makes a request to google maps autocomplete api to get predictions based off of your query
  //it populates your popover with the top prediction
  s.GooglePlacesRequest = (placesSearchInput) => {
    //set up as a promise so that you can use it within FieldJournalDetailedPicModalCtrl.js
    return new Promise ((resolve, reject) => {
      //if there's already a request happening, stop it and start over
      $timeout.cancel(request);
      s.showRequests = false;
      s.searchPrediction = false;

      request = $timeout(function() {
        //s.location is updated on focus of the input field             
        if(!placesSearchInput) return;
        //make an api call user the user's input value and your current location        
        GooglePlacesAutoComplete.search(placesSearchInput.toLowerCase(), s.myLocation).then(
            (googleMapsRequestObj) => {             
              s.predictions = googleMapsRequestObj.data.predictions;            
              //update popover  
              s.newFieldJournalPopup = "../../partials/BootstrapTemplates/NewFieldJournalPopup.html";           
              //enables popover
              s.searchPrediction = true;  
              //resolve with your predictions obj
              resolve({
                predictions: googleMapsRequestObj.data.predictions,
                searchPrediction: true
              });                   
            }
          );          
      }, 500);
    });
  };

  //whenever you click between views, this function gets called. whichPic is a string the represents the 'view' of the page
	s.changeBackground = (whichPic) => {
		s.background = whichPic;		
		let backgroundImage = `../../images/${s.background}.jpg`;
		$("#home-container").css("background-image", 'url(' + backgroundImage + ')');
	};

  //Handles logout functions for the user
	s.logout = () => AuthUserFactory.logoutUser();

  //This gathers a bunch of information regarding google maps places library
  //Whenever a user selects a place from the autocomplete input, this gets caled
  s.logSelectedLocation = (mySelectedLocation) => {
    return new Promise((resolve, reject) => {
      //change the value of the input field
      $("#newDrinkLocation").val(mySelectedLocation.description);
      let edits = {};
      
      //declare google maps places library service to get some better details on the location
      var service = new google.maps.places.PlacesService(document.createElement('div'));
      //call the service, passing in the location's coords
      service.getDetails({placeId: mySelectedLocation.place_id}, function(place, status) {
        //check status
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          //get all details related to your selected place and add them to s.newDrink                     
          edits.place_id = place.place_id;
          edits.google_rating = place.rating;
          edits.location_title = place.name;
          edits.location_address = place.formatted_address;
          edits.location_phone_number = place.formatted_phone_number;
          edits.lat = place.geometry.location.lat();
          edits.lng = place.geometry.location.lng();        
          edits.store_hours = {}; 
          //this created an obj that holds store hours for your location       
          let storeHours = place.opening_hours.weekday_text;
          storeHours.forEach((day) => {                   
            let separator = day.indexOf(':'),
                dayName = day.slice(0, separator),
                dayHours = day.slice(separator+2, day.length);

            edits.store_hours[dayName] = dayHours;
          });           
          resolve(edits);
        }
      });      
    });

  };  

  //this gets called whenever you click on a specific locations name on a field journal entry
  //It opens a modal with a map view and directions leading to that given place
  s.openMapModal = (selectedCoords) => {        
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'map-modal-title',
      ariaDescribedBy: 'map-modal-body',
      templateUrl: '../../partials/MapModal.html',      
      controller: 'MapModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".home-map-modal-parent"),  
      resolve: {
        //pass in coords of  given location
        locationCoordsPlaceId: function() {         
          return selectedCoords;
        },
        //also pass your current location coords
        currentLocationCoords: function() {          
          return s.myLocation;
        }
      }
    }); 

    modalInstance.result.then( 
      (selectedItem) => s.selected = selectedItem,
      () => console.log("Dismissed")
    );

  };

  //openss a setting modal where you can adjust your user's personal settings
	s.openSettings = () => {		
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/UserSettingsModal.html',      
      controller: 'UserSettingsCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".home-settings-modal-parent"),        
      resolve: {
      	user: function() {      		
      		return s.currentUseruser;
      	}
      }
    }); 

    modalInstance.result.then(
      (selectedItem) => s.selected = selectedItem,
      () => console.log("Dismissed")
    );
	};

  //config for a more detailed view of any given field journal entry
  s.detailedPicModal = (entry, event) => {
    
    //check for specific html elements
    if ($(event.target).hasClass('fieldJournal-pic-detail-location-btn')) return;
    if ($(event.target).hasClass('newsfeed-entry-location')) return;
    
    //define actual config
    var modalInstance = $uibModal.open({
      animation: true,      
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/FieldJournalDetailedPicModal.html',      
      controller: 'FieldJournalDetailedPicModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".home-detailed-pic-modeal-parent"),  
      resolve: {
        //selected entry to view
        fieldJournalEntry: function() {         
          return entry;
        },
        //your location coords
        currentLocation: function() {
          return s.myLocation;
        },
        //function for autocomplete on a given location
        fieldJournalGooglePlacesRequest: function() {
          return s.GooglePlacesRequest;
        },
        //pass in slider config for whenever you're editing an entry
        slider: function() {
          return s.slider1;
        },
        //what page you're on
        pageLocation: function() {
          return s.background;
        },
        logSelectedLocation: function() {
          return s.logSelectedLocation;
        }
      }
    }); 

    //dismissal function
    modalInstance.result.then(
      (selectedItem) => s.selected = selectedItem,
      () => console.log("Dismissed")
    );
  };


});

