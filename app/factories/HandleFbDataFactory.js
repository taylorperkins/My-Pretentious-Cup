"use strict";

console.log("HandleFbDataFactory.js is connected");

app.factory("HandleFBDataFactory", function($q, $http, FBCreds, AuthUserFactory, UserStorageFactory, fbRef) {

	//This function goes to firebase, organizes the object returned, and stores it locally.
	//Args: Single location string Ex: 'users', 'pins', 'board'
	//Return: locationInfo Obj

	//User's UID is provided within getItemList()

	let createNewFirebaseEntry = (createdObj, location) => {
		return new Promise((resolve, reject) => {
			var newKey = fbRef.database().ref().child(`${location}`).push().key,
					updates = {};
		  updates[`/${location}/` + newKey] = createdObj;
		  fbRef.database().ref().update(updates);
		  fbRef.database().ref(`${location}`).once('value').then(
	  		(snapshot) => {
		  		console.log("Newly updated shiz: ", snapshot.val());
	  			resolve();
	  		}
	  	);
		});
	};
































	let getItemList = (location) => {

		let userUID = UserStorageFactory.getCurrentUserInfo();

		if (userUID.hasOwnProperty('uid')) {
			userUID = userUID.uid;
		} else {
			userUID = userUID[Object.keys(userUID)[0]].uid;
		}
		return $q((resolve, reject) => {
			$http.get(`${FBCreds.databaseURL}/${location}.json?orderBy="uid"&equalTo="${userUID}"`).then(
					(itemObject) => {
						console.log("This is your itemCollection from within HandleFBDataFactory.js getItemList(): ", itemObject);
						if ( Object.values(itemObject.data).length > 0 ) {
							resolve(itemObject.data);							
						} else {
							console.log("You have no data in firebase!");
							reject();
						}
				}).catch((error) => reject(error));
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
	let deleteItem = (location) => {
		return $q((resolve, reject) => {			
			$http.delete(`${FBCreds.databaseURL}/${location}.json`)
				.then((objStatusFromFirebase) => resolve(objStatusFromFirebase));
		});
	};


	let putItem = (editedItem, location) => {

		let userUID = UserStorageFactory.getCurrentUserInfo();

		if (userUID.hasOwnProperty('uid')) {
			userUID = userUID.uid;
		} else {
			userUID = Object.keys(userUID)[0];
		}
		console.log("Within HandleFbDataFactory.js putItem(): ", editedItem, location);
		return $q((resolve, reject) => {
			$http.put(`${FBCreds.databaseURL}/fieldJournal/${location}.json`, 
				angular.toJson(editedItem))
					.then(
							(editedObjStatus) => {
								console.log("Here is the edited status from firebase: ", editedObjStatus);
								resolve(editedObjStatus);
							}
					).catch((error) => error);
		});
	};

	return {	
						getItemList, 
						postNewItem, 
						deleteItem, 
						putItem,

						//Trying to utilize firebase's built in crud application
						createNewFirebaseEntry

					};

});
