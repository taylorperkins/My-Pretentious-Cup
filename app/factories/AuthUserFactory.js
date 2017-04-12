"use strict";

app.factory("AuthUserFactory", function(fbRef, $window) {	

	//Args: {email: '', password: ''}
	//Return: User obj from Firebase
	let createUser = (userObj) => fbRef.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
			.catch( (error) => console.log("error: ", error.code, error.message));
	

	//Args: {email: '', password: ''}
	//Return: UserObj from Firebase
	let loginUser = (userObj) => fbRef.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
		.catch( (error) => {
			console.log("error:", error.code, error.message);
			$window.location.href = '#!/login';
		});
	

	//Removes any data stored within localStorage
	//Signs user out of fbRef
	let logoutUser = function() {				
		$window.location.href = '#!/login';
		return fbRef.auth().signOut();
	};


	//Checks fbRef onAuthStateChanged() and sets currentUser to uid 
	//Return: boolean- true if logged in
	let isAuthenticated = function () {
		return new Promise ( (resolve, reject) => {
			fbRef.auth().onAuthStateChanged( (user) => {
				if (user) { resolve(user); }
				else { resolve(false); }
			});
		});
	};

	//Sets google as an available provider
	let googleProvider = new firebase.auth.GoogleAuthProvider();

	//Sign in with given provider using fbRef
	//Args: providerType Ex: googleProvider
	let authWithProvider = () => fbRef.auth().signInWithPopup(googleProvider);

	return {
		createUser,
		loginUser, 
		logoutUser, 	
		isAuthenticated, 
		authWithProvider
	};
	
});
