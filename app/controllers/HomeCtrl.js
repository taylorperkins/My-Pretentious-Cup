"use strict";

console.log("HomeCtrl.js is connected");

app.controller("HomeCtrl", function($scope, $sce, $timeout, $uibModal, $window, AuthUserFactory, GoogleMapsConfig, fbRef, UserStorageFactory) {
	let s = $scope;

	console.log("HomeCtrl.js is working");

	s.background = 'main';
  let user = UserStorageFactory.getCurrentUserInfo();
  s.currentUser = user[Object.keys(user)[0]];
  s.currentUser.ugly_id = Object.keys(user)[0];

  var userRef = fbRef.database().ref('users/').child(s.currentUser.ugly_id);
  userRef.on('value', function(snapshot) {
    console.log(snapshot.val());
    let user = snapshot.val();
    user.ugly_id = s.currentUser.ugly_id;
    console.log("Your user is changing!", user);
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
    s.myLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);       

    let myLocation = {
      lat: s.myLocation.lat(),
      lng: s.myLocation.lng()
    };

    console.log("Here is my location from HomeCtrl.js: ", myLocation);
    UserStorageFactory.setUserCurrentLocation(myLocation);    
  });   


	s.changeBackground = (whichPic) => {
		s.background = whichPic;
		console.log(s.background);
		let backgroundImage = `../../images/${s.background}.jpg`;
		$("#home-container").css("background-image", 'url(' + backgroundImage + ')');
	};

	s.logout = () => AuthUserFactory.logoutUser();

  s.openMapModal = (selectedCoords) => {        
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'drinkingBuddies-modal-title',
      ariaDescribedBy: 'drinkingBuddies-modal-body',
      templateUrl: '../../partials/DrinkingBuddiesMapModal.html',      
      controller: 'DrinkingBuddiesMapModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".home-map-modal-parent"),  
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

    modalInstance.result.then(function (selectedItem) {
      s.selected = selectedItem;
    }, function () {
      console.log("Dismissed");
    });
	};
});

