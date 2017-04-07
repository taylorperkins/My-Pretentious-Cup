"use strict";

app.controller("RegisterCtrl", function($scope, $location, fbRef, AuthUserFactory, UserStorageFactory) {
	let s = $scope;	

	s.currentUser = false;
	s.rows = [];	
	s.userInfo = {
		firstName: "",
		lastName: "",
		email: "",
		userName: "",
		password: "",
		reEnterPassword: "",
		birthDate: "",		
		uid: ""
	};	

	s.registerNewUser = () => {

		if (s.userInfo.firstName === "" || s.userInfo.lastName === "" || s.userInfo.userName === "" || s.userInfo.email === "" || s.userInfo.password.length < 6 ) {			
			alert("Please fill out the required fields and try again.");
			//Check to make sure that both passwords are the same
		} else {
			//If passowrds are not the same, alert the user
			if (s.userInfo.password !== s.userInfo.reEnterPassword) {
				alert("It looks like your passwords aren't the same!! Please make sure your passwords are the same before continuing.");
				$('input[type="password"]').val('');
				$('#newPassword').focus();
			} else {				
				AuthUserFactory.createUser({email: s.userInfo.email, password: s.userInfo.password}).then(
					// Update uid, remove passwords, and join interests to string instead of array to make Firebase happy
					(userData) => {						
						// AuthUserFactory.setLogin(true);
						s.userInfo.uid = userData.uid;
						s.myUser = s.userInfo;

						let userPassword = s.myUser.password,
								userEmail = s.myUser.email;
						//delete passwords before saving to firebase
						delete s.myUser.password;
						delete s.myUser.reEnterPassword;	

						//Create a new key within firebase which we will store our user obj					
						var newKey = fbRef.database().ref().child('users').push().key,
								updates = {};
						//set the updaye reference equal to the user
						updates[`/users/${newKey}`] = s.myUser;
						fbRef.database().ref().update(updates).then(
								() => {
									//with newly created user, log him in
									AuthUserFactory.loginUser({email: userEmail, password: userPassword}).then( 
							  		(userData) => {											
											AuthUserFactory.setLogin(true);		
											//Once the user is logged in, go to firebase to retrieve the user's info									
											fbRef.database().ref('users').orderByChild('uid').equalTo(userData.uid).once('value').then(
								    			(snapshot) => {			    						    			
									    			let user = snapshot.val();
									    			//set the user's info within local storage
									    			UserStorageFactory.setCurrentUserInfo(user);
								    				$location.path('/home');		    				
								    				s.$apply();
								    			}
								    		);															
										},
										(error) => console.log("Error creating user: ", error)										
									);						
								},
								(error) => console.log("Error creating user: ", error)
						);

					}			
				);
			}
		}
	};

});


