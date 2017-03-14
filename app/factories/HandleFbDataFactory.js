"use strict";

console.log("HandleFbDataFactory.js is connected");

app.factory("HandleFBDataFactory", function($q, $http, FBCreds, AuthUserFactory, UserStorageFactory) {

	//This function goes to firebase, organizes the object returned, and stores it locally.
	//Args: Single location string Ex: 'users', 'pins', 'board'
	//Return: locationInfo Obj
	let getItemList = (location) => {

		let user = UserStorageFactory.getCurrentUserUid();
		console.log("I am now within HandleFBDataFactory.js getItemList() to get: ", location);
		console.log(user);

		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/${location}.json?orderBy="uid"&equalTo="${user}"`).then(
					(itemObject) => {
						console.log("This is your itemCollection from within HandleFBDataFactory.js getItemList(): ", itemObject);
						if ( Object.values(itemObject.data).length > 0 ) {

							switch(location) {				
								case 'users': 
									let usersInfo = itemObject.data;
									resolve(usersInfo);
									break;}		

						} else {
							console.log("You have no data in firebase!");
							UserStorageFactory.setUserInfo('', location).then(
								() => {
									console.log(location + " set in UserStorage to ''");
									resolve();									
								}
							);
						}
				}).catch((error) => reject(error));
		});
	};


	let getUserInfo = () => {
		return new Promise((resolve, reject) => {
			getItemList('users').then(
    			(usersObjData) => UserStorageFactory.setUserinfo(usersObjData, 'users')
    		).then( resolve());
		});
	};



	//Function to post items to Firebase
	//Args(2): newItem = {usersInfo/pinsInfo/boardInfo: ''}, location = string representing firebase collection ('users', 'pins', 'board')
	//Return: Location Obj from Firebase {}
	let postNewItem = (newItem, location) => {
		return $q((resolve, reject) => {
			$http.post(`${FBCreds.databaseURL}/${location}.json`,
				angular.toJson(newItem))
					.then(
						(ObjectFromFirebase) => {
							console.log("Here is my obj from firebase from HandleFBDataFactory.js postNewItem(): ", ObjectFromFirebase);
							resolve(ObjectFromFirebase);
						})
					.catch((error) => error);
		});
	};



	//Function to remove items from a specific collection from within Firebase
	//Args(2): itemID: string assigned by firebase, location: string for specific collection Ex: ('users', 'board', 'pins')
	let deleteItem = (itemID, location) => {
		console.log('Within ItemFactory.js deleteItem(): ', itemID, 'location: ', location);
		return $q((resolve, reject) => {			
			$http.delete(`${FBCreds.databaseURL}/${location}/${itemID}.json`)
				.then((ObjectFromFirebase) => resolve(ObjectFromFirebase));
		});
	};

	return {	getItemList, 
						getUserInfo, 
						postNewItem, 
						deleteItem		};

});
