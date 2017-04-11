"use strict";


app.controller("ProfilePicCtrl", function($scope, $http, $state, fbRef, $uibModalInstance, user) {
	let s = $scope;	

	//Set up initial cropper properties to reference
	s.cropper = {};
  s.cropper.sourceImage = null;
  s.cropper.croppedImage   = null;
  s.bounds = {};
  s.bounds.left = 0;
  s.bounds.right = 0;
  s.bounds.top = 0;
  s.bounds.bottom = 0;

  console.log(user);

  //cancel method for handling modal exits
	s.cancel = () => $uibModalInstance.dismiss('cancel');	

	//save cropped profile picture, while also updating all database fieldJournal entries related to that user
	//you will be updating your user's info,
	//then also updating all entries.profile_pic property
	s.saveProfilePic = () => {
		//check if you dont have a cropped image
		if (s.cropper.croppedImage === null) {
			alert("How about you upload a pic and crop it!");			
		//
		} else {	
			//create an image placement instance for your user collection profile_pic		
			let imagePlacement = {};
			imagePlacement[`/users/${user.uglyId}/profile_picture`] = s.cropper.croppedImage;			
			
			//update your data base under users collection
			fbRef.database().ref().update(imagePlacement).then(
					() => {			
							//reference your current user's field journal collection													
							fbRef.database().ref('fieldJournal').orderByChild('uid').equalTo(user.uid).once('value').then(
								(snapshot) => {
									//create nistances for your field Journal entries profile pic property
									let fieldJournalEntries = snapshot.val(),
											imageLocation = {};

									//This is a function which is set up to be a resolve. 
									//This function creates a new property on imageLocation object to be updated within firebase
									let createImageLocationObject = (fieldJournalUglyId) => {
										return new Promise((resolve, reject) => {
											imageLocation[`/fieldJournal/${fieldJournalUglyId}/profile_picture`] = s.cropper.croppedImage;
											resolve(imageLocation);
										});
									};

									//do a promise.all over your fieldJournal entries, updating your imageLocation Obj for each one
									Promise.all(Object.keys(fieldJournalEntries).map((entry) => createImageLocationObject(entry))).then(
											(snapshotArr) => {														
												//then take your imageLocation and update firebase
												fbRef.database().ref().update(imageLocation).then(
														() => s.cancel()
													);																												
											}
										);																																							
								}
							);
					}
				);						
		}
	};


});






