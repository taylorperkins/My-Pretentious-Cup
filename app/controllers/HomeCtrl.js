"use strict";

app.controller("HomeCtrl", function($scope, $sce, $timeout, $uibModal, $window, AuthUserFactory, GoogleMapsConfig, fbRef, isAuth, GooglePlacesAutoComplete) {
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
    s.fieldJournal = Object.keys(fieldJournals).reverse().map((entry) => {
      fieldJournals[entry].uglyId = entry;
      return fieldJournals[entry];
    });
  });
    
  //this function listens to the current user's user collection obj within firebase for any changes, 
  //then updates s.current user based on those changes
  fbRef.database().ref('users/').orderByChild('uid').equalTo(isAuth.uid).on("value", function(snapshot) {
    //grab snapshot from firebase
    let user = snapshot.val(),    
        currentUser = user[Object.keys(user)[0]];
    currentUser.uglyId = Object.keys(user)[0];        
    $timeout(() => s.currentUser = currentUser );
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
  $window.navigator.geolocation.getCurrentPosition(function(position) {    
    let myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);       
    s.myLocation = {
      lat: myLocation.lat(),
      lng: myLocation.lng()
    };     
  });   

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

