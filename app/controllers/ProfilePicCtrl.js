"use strict";

console.log("ProfilePicCtrl.js is connected");

app.controller("ProfilePicCtrl", function($scope, $http, $state, fbRef, $uibModalInstance, UserStorageFactory) {
	console.log("ProfilePicCtrl.js is working");
	let s = $scope;	

	s.cropper = {};
  s.cropper.sourceImage = null;
  s.cropper.croppedImage   = null;
  s.bounds = {};
  s.bounds.left = 0;
  s.bounds.right = 0;
  s.bounds.top = 0;
  s.bounds.bottom = 0;

	s.showPicture = () => console.log(s.cropper); console.log(s.bounds);

	s.cancel = () => $uibModalInstance.dismiss('cancel');

	s.saveProfilePic = () => {
		if (s.cropper.croppedImage === null) {
			alert("How about you upload a pic and crop it!");			
		} else {
			let user = UserStorageFactory.getCurrentUserInfo(),
					key = Object.keys(user)[0];					

			console.log("User and key from ProfilePicCtrl.js: ", user, key);					
			let imagePlacement = {};
			imagePlacement[`/users/${key}/profile_picture`] = s.cropper.croppedImage;			
			
			fbRef.database().ref().update(imagePlacement).then(
					() => {
						console.log("you did it son");
						fbRef.database().ref('users').child(key).once('value').then(
								(snapshot) => {
									console.log("Here's your user from fb: ", snapshot.val());
									let userData = snapshot.val(),
										  user = {};

									userData.ugly_id = key;								
									user[key] = userData;
									UserStorageFactory.setCurrentUserInfo(user);									

									console.log("Here is your user from ProfilePicCtrl.js: ", userData);

									fbRef.database().ref('fieldJournal').orderByChild('uid').equalTo(userData.uid).once('value').then(
										(snapshot) => {
											console.log("Here's your snapshot: ", snapshot.val());
											let fieldJournalEntries = snapshot.val();
											for (var entry in fieldJournalEntries) {
												let imageLocation = {};
												imageLocation[`/fieldJournal/${entry}/profile_picture`] = s.cropper.croppedImage;
												fbRef.database().ref().update(imageLocation).then(
														() => {
															console.log("All your shit should be updated!");															
														}
													);
											}
											$state.reload();															
										}
									);

								}
							);
					}
				);						
		}
	};

	s.showDataURL = () => {
		console.log("I am working");
		let myCanvas = document.getElementById("cropped-image");
		myCanvas.toDataURL(s.cropper.croppedImage);
	};

});






