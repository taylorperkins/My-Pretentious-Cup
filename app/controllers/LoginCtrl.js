"use strict";

app.controller("LoginCtrl", function($scope, $location, $timeout, fbRef, AuthUserFactory) {
	let s = $scope;	

	//setting up initial account obj
	s.account = {
		email: '',
		password: ''
	};

	//when login button is clicked	
	s.login = () => {
		//takes user's account information and passes it to get authenticated through firebase
  	AuthUserFactory.loginUser(s.account).then( 
  		(userData) => {		  				
  			$timeout(() => $location.path('/home') );
			},
			(error) => console.log("Error creating user: ", error)
		);
	};

	//When you choose to login with google
	s.loginGoogle = () => {				
		AuthUserFactory.authWithProvider()
			.then(
				(userInfo) => {		  					
  				$location.path('/home');  					    				  						    			   
  				$timeout(() => $location.path('/home') );
			}).catch(
				(error) => {
		    	// Handle the Errors.
		    	console.log("error with google login", error);		    	
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