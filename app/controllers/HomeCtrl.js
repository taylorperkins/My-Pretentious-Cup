"use strict";

app.controller("HomeCtrl", function($scope, $sce, $timeout, $uibModal, $window, AuthUserFactory, GoogleMapsConfig, fbRef, UserStorageFactory, GoogleMapsFactory) {
	let s = $scope,
      user = UserStorageFactory.getCurrentUserInfo(),
      request;

  s.background = 'main';
  s.currentUser = user[Object.keys(user)[0]];
  s.currentUserFieldJournal = [];
  s.currentUser.ugly_id = Object.keys(user)[0];

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
  
  fbRef.database().ref('fieldJournal/').orderByChild('uid').equalTo(s.currentUser.uid).on("value", function(snapshot) {    
    let  fieldJournals = snapshot.val();
    s.fieldJournal = Object.keys(fieldJournals).reverse().map((entry) => {
      fieldJournals[entry].uglyId = entry;
      return fieldJournals[entry];
    });
    
  });
    
  fbRef.database().ref('users/').child(s.currentUser.ugly_id).on("value", function(snapshot) {
    let user = snapshot.val();
    user.ugly_id = s.currentUser.ugly_id;    
    s.currentUser = user;    
  });
  
	console.log(s.background);

	var windowHeight = window.innerHeight - 400;
	$timeout(function() {
		$(".main-row").height(windowHeight);
		$(".fieldJournal-row").height(windowHeight);
		$(".drinkingBuddies-row").height(windowHeight);
		$(".globe-row").height(windowHeight);
	}, 100);

  //As soon as the controller loads, grab the user's current location, and display an info-window 
  //showing their current location. Also, send the coords to be saved within 
  //UserStorageFactory.js to be referrenced by other controllers
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
        GoogleMapsFactory.GoogleMapsAutoComplete(placesSearchInput.toLowerCase(), s.myLocation).then(
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

	s.changeBackground = (whichPic) => {
		s.background = whichPic;		
		let backgroundImage = `../../images/${s.background}.jpg`;
		$("#home-container").css("background-image", 'url(' + backgroundImage + ')');
	};

	s.logout = () => AuthUserFactory.logoutUser();

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
        locationCoordsPlaceId: function() {         
          return selectedCoords;
        },
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

	s.openSettings = () => {
		console.log("Here is where you should edit your user's settings");    
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/UserSettingsModal.html',      
      controller: 'UserSettingsCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".modal-parent"),  
      resolve: {
      	user: function() {
      		let user = UserStorageFactory.getCurrentUserInfo(),
      				uglyId = Object.keys(user)[0];
      		user = user[uglyId];
      		user.ugly_id = uglyId;
      		return user;
      	}
      }
    }); 

    modalInstance.result.then(
      (selectedItem) => s.selected = selectedItem,
      () => console.log("Dismissed")
    );
	};

  //config for a more detailed 
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

