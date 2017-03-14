"use strict";

console.log("AuthUserFactory.js is connected");

app.factory("AuthUserFactory", function(fbRef, $window) {

	let isLoggedIn = false;

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
		console.log("logoutUser");
		isLoggedIn = false;		
		localStorage.removeItem('user');
		$window.location.href = '#!/login';
		return fbRef.auth().signOut();
	};


	//Args: boolean
	//Changes isLoggedIn boolean
	let changeLogin = (loginState) => isLoggedIn = loginState;

	let getLogin = () => isLoggedIn;

	//Checks fbRef onAuthStateChanged() and sets currentUser to uid 
	//Return: boolean- true if logged in
	let isAuthenticated = function () {
		return new Promise ( (resolve, reject) => {
			fbRef.auth().onAuthStateChanged( (user) => {
				if (user){
					isLoggedIn = true;
					console.log("Here is your var currentUser from AuthUserFactory.js isAuthenticated(): ", user);
					resolve(isLoggedIn);
				}else {
					isLoggedIn = false;
					resolve(false);
				}
			});
		});
	};


	//Sets google provider
	let googleProvider = new firebase.auth.GoogleAuthProvider();
	//Sign in with given provider using fbRef
	//Args: providerType Ex: googleProvider
	//Return: 
	let authWithProvider = () => fbRef.auth().signInWithPopup(googleProvider);

	return {	createUser,
						loginUser, 
						logoutUser, 
						changeLogin, 
						getLogin,
						isAuthenticated, 
						authWithProvider	};
	
});
