"use strict";

console.log("RegisterCtrl.js is connected");

app.controller("RegisterCtrl", function($scope, $location, AuthUserFactory, HandleFBDataFactory, UserStorageFactory) {
	let s = $scope;
	console.log("RegisterCtrl.js is working");

	s.currentUser = false;

	s.userInfo = {
		firstName: "",
		lastName: "",
		email: "",
		userName: "",
		password: "",
		reEnterPassword: "",
		birthDate: "",
		favoriteDrink: "Fave Le Drank",
		uid: ""
	};

	s.rows = [];
	s.drinks = 		['Coffee', 'Tea', 'Beer', 'Wine'];

	s.updateFavoriteDrinkInfo = (drinkCategory) => s.userInfo.favoriteDrink = drinkCategory;

	s.registerNewUser = () => {

		if (s.userInfo.firstName === "" || s.userInfo.lastName === "" || s.userInfo.userName === "" || s.userInfo.email === "" || s.userInfo.password.length < 6 || s.userInfo.favoriteDrink === "Fave Le Drank" ) {
			console.log("Here is your user info: ", s.userInfo);
			alert("Please fill out the required fields");
			//Check to make sure that both passwords are the same
		} else {

			if (s.userInfo.password !== s.userInfo.reEnterPassword) {
				alert("It looks like your passwords aren't the same!! Please make sure your passwords are the same before continuing.");
				$('input[type="password"]').val('');
				$('#newPassword').focus();
			} else {
				console.log("This is ready to be sent to firebase!! ", s.userInfo);			
				AuthUserFactory.createUser({email: s.userInfo.email, password: s.userInfo.password}).then(

					// Update uid, remove passwords, and join interests to string instead of array to make Firebase happy
					(userData) => {
						console.log("RegisterCtrl new user: ", userData);
						// AuthUserFactory.changeLogin(true);
						s.userInfo.uid = userData.uid;
						s.myUser = s.userInfo;
						delete s.myUser.password;
						delete s.myUser.reEnterPassword;
						console.log("Here is my user after password deletion: ", s.myUser);
						HandleFBDataFactory.postNewItem(s.myUser, 'users').then(
							(profileObjFromFirebase) => {
								console.log("Here is your profile info from firebase: ", profileObjFromFirebase);									// send User Info from firebase to be stored within localstorage
								UserStorageFactory.setUserInfo(s.myUser, 'user');
								s.userInfo = {};
								$location.path('/home');
							});
					},
					(error) => console.log("Error creating user: ", error)
				);
			}			
		}
	};

});