"use strict";

app.controller("LoginCtrl", function($scope, $location, fbRef, AuthUserFactory, UserStorageFactory) {
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
  			//if the user is logged in, define that user login is true
				AuthUserFactory.setLogin(true);				
				//Go to firebase to reference that user's information, then store it all within
				//local storage
				fbRef.database().ref('users').orderByChild('uid').equalTo(userData.uid).once('value').then(
		    			(snapshot) => {			    						    			
			    			let user = snapshot.val();
			    			UserStorageFactory.setCurrentUserInfo(user);
			    			//Once the user's information has been set, change the location to /home
		    				$location.path('/home');		    				
		    				s.$apply();
		    			}
		    		);		  					
			},
			(error) => console.log("Error creating user: ", error)
    );
	};

	//When you choose to login with google
	s.loginGoogle = () => {				
		AuthUserFactory.authWithProvider()
			.then(
				(userInfo) => {		  
					//if a user, set user login to true  	
		    	AuthUserFactory.setLogin(true);
		    	console.log(userInfo);		    	
		    	//reference the user's stored informtion from within firebase
		    	fbRef.database().ref('users').orderByChild('uid').equalTo(userInfo.user.uid).once('value').then(
		    			(snapshot) => {			    						    			
			    			let user = snapshot.val();
			    			//set the user's information within local storage
			    			UserStorageFactory.setCurrentUserInfo(user);
		    				$location.path('/home');		    				
		    				s.$apply();
		    			}
		    		);		    

			}).catch(
				(error) => {
		    	// Handle the Errors.
		    	console.log("error with google login", error);
		    	AuthUserFactory.setLogin(false);
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