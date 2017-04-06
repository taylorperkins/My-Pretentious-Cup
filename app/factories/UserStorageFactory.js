"use strict";

console.log("UserStorageFactory.js is connected");

app.factory("UserStorageFactory", function() {

	//Information received at registration
	let loggedInUserInfo = {
		firstName: '',
		lastName: '',
		mailingAddress: '',
		emailAddress: '',
		userName: '', 
		birthday: ''		
	};

	//userCurrentLocation is an object given by google.maps.LatLng which displays the object with 
	//lat and lng properties as functions to be called. 
	//Ex: userCurrentLocation.lat()
	let userCurrentLocation = {};	

	//variables to hold users' info
	let getCurrentUserInfo = () => angular.fromJson(localStorage.getItem('user'));
	let setCurrentUserInfo = (profileObj) => localStorage.setItem('user', JSON.stringify(profileObj));

	let getUserCurrentLocation = () => userCurrentLocation;
	let setUserCurrentLocation = (locationCoords) => userCurrentLocation = locationCoords;	

	
	return {				
						getCurrentUserInfo,
						setCurrentUserInfo,

						getUserCurrentLocation,
						setUserCurrentLocation,
	};
	
});
