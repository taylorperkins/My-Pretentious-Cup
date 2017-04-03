"use strict";

console.log("LoginCtrl.js is connected");

app.controller("LoginCtrl", function($scope, $location, AuthUserFactory, HandleFBDataFactory, UserStorageFactory) {
	let s = $scope;
	console.log("LoginCtrl.js is working");

	s.account = {
		email: '',
		password: ''
	};

	//takes s.account and sends the obj to AuthUserFactory.js to log the user in. 
	//Also changes the window to /list view
	s.login = () => {
  	console.log("you clicked login");
  	console.log("Here is my account info: ", s.account);
  	AuthUserFactory.loginUser(s.account).then( 
  		(userData) => {
				console.log("LoginCtrl.js login user: ", userData.uid);
				AuthUserFactory.changeLogin(true);
				UserStorageFactory.setCurrentUserInfo({uid: userData.uid});				
				HandleFBDataFactory.getItemList('users').then(
					(profileObjFromFirebase) => {
						console.log("Here is your profile info from firebase: ", profileObjFromFirebase);
						UserStorageFactory.setCurrentUserInfo(profileObjFromFirebase);
						$location.path('/home');													
					});				
			},
			(error) => console.log("Error creating user: ", error)
    );
	};

	//
	s.loginGoogle = () => {
		console.log("you clicked login with Google");
		AuthUserFactory.authWithProvider()
			.then(
				(userInfo) => {
		    	console.log("logged in user:", userInfo);
		    	AuthUserFactory.changeLogin(true);
		    	s.userUID = userInfo.user.uid;	
		    	UserStorageFactory.setCurrentUserInfo({uid: s.userUID});		    	
		    	HandleFBDataFactory.getItemList('users').then(
	    			(profileObjData) => {
		    			console.log("Here is your profileObj from firebase LoginCtrl.js: ", profileObjData);
		    			UserStorageFactory.setCurrentUserInfo(profileObjData);
	    				$location.path('/home');
	    			}
	    		);

			}).catch(
				(error) => {
		    	// Handle the Errors.
		    	console.log("error with google login", error);
		    	AuthUserFactory.changeLogin(false);
		    	var errorCode = error.code;
		    	var errorMessage = error.message;
		    	// The email of the user's account used.
		    	var email = error.email;
		    	// The firebase.auth.AuthCredential type that was used.
		    	var credential = error.credential;
		  		// ...
				});
		};
		
});