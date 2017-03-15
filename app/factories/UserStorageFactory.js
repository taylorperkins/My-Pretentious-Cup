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

	let currentUserUid = '';

	//variables to hold users' info
	let getCurrentUserInfo = () => angular.fromJson(localStorage.getItem('user'));
	let setCurrentUserInfo = (profileObj) => localStorage.setItem('user', JSON.stringify(profileObj));
	
	let setCurrentUserUid = (userUid) => currentUserUid = userUid;
	let getCurrentUserUid = () => currentUserUid;

	
	return {	
						getCurrentUserUid,
						setCurrentUserUid,
						getCurrentUserInfo,
						setCurrentUserInfo
				 	};
	
});
