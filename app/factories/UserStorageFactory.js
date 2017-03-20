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

	let myFieldJournalEntries = [];

	let currentUserUid = '';
	//userCurrentLocation is an object given by google.maps.LatLng which displays the object with 
	//lat and lng properties as functions to be called. 
	//Ex: userCurrentLocation.lat()
	let userCurrentLocation = {};

	//variables to hold users' info
	let getCurrentUserInfo = () => angular.fromJson(localStorage.getItem('user'));
	let setCurrentUserInfo = (profileObj) => localStorage.setItem('user', JSON.stringify(profileObj));

	let getUserCurrentLocation = () => userCurrentLocation;
	let setUserCurrentLocation = (locationCoords) => userCurrentLocation = locationCoords;
	
	let getCurrentUserUid = () => currentUserUid;
	let setCurrentUserUid = (userUid) => currentUserUid = userUid;

	let getCurrentFieldJournal = () => myFieldJournalEntries;
	let setCurrentFieldJournal = (fieldJournalArr) => myFieldJournalEntries = fieldJournalArr; 

	
	return {	
						getCurrentUserUid,
						setCurrentUserUid,

						getCurrentUserInfo,
						setCurrentUserInfo,

						getUserCurrentLocation,
						setUserCurrentLocation,

						getCurrentFieldJournal,
						setCurrentFieldJournal
				 	};
	
});
