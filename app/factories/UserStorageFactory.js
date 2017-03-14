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
	let currentUserInfo = () => angular.fromJson(localStorage.getItem('user'));
	
	let setCurrentUserUid = (userUid) => currentUserUid = userUid;
	let getCurrentUserUid = () => currentUserUid;


	//Args: The obj name you want to store within localStorage 
	//Ex: 'board', 'pins', 'users'
	let getUserInfo = (location) => {
		switch (location) {
			case 'user': 
				return currentUserInfo();
		}		
		// JSON.parse(localStorage.getItem(location));
	};


	//Args(2): userinfoObj = {userInfoInformation in obj form}, location = ('board', 'pins', 'users')
	let setUserInfo = (userInfoObj, location) => {
		return new Promise((resolve) => {
			switch(location) {
				case 'user': 		
					localStorage.removeItem('user');		
					localStorage.setItem('user', angular.toJson(userInfoObj));
					resolve();
					break;				
			}
		});
	};
	
	return {	getUserInfo, 
						setUserInfo,
						setCurrentUserUid,
						getCurrentUserUid 	};
	
});
