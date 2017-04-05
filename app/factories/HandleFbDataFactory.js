"use strict";

app.factory("HandleFBDataFactory", function($q, $http, FBCreds, AuthUserFactory, UserStorageFactory, fbRef) {

	//This function goes to firebase, organizes the object returned, and stores it locally.
	//Args: Single location string Ex: 'users', 'pins', 'board'
	//Return: locationInfo Obj

	//User's UID is provided within getItemList()
	let getItemList = (location) => {

		let userUID = UserStorageFactory.getCurrentUserInfo();

		if (userUID.hasOwnProperty('uid')) { userUID = userUID.uid; } 
		else { userUID = userUID[Object.keys(userUID)[0]].uid; }
		
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

	return {	
						//Trying to utilize firebase's built in crud application
						getItemList, 						
					};

});

