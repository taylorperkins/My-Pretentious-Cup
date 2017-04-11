
"use strict";

app.controller("DrinkingBuddiesCtrl", function($scope, $sce, fbRef, $filter, $uibModal) {
	let s = $scope;

	s.drinkingBuddiesListReusable = '../../partials/Reusables/DrinkingBuddiesList.html';
	s.drinkingBuddiesEntryDisplay = '../../partials/DrinkingBuddiesEntryDisplay.html';

	s.currentSearch = false;
	s.selectFollower = false;
	
	s.userSearch = [];
	s.drinkingBuddies = [];
	s.uidArray = [];	


	//updates your following list and displays them on your page
	let updateFollowingList = () => {
		s.drinkingBuddies = [];
		s.uidArray = [];
		//if your user is actually following someone 
		if (s.currentUser.hasOwnProperty('following')) {			
			//create new array to hold all available ids
			let usersUIDs = [];
			//for each user in following list.. push the uid to the userUids array
			for (var user in s.currentUser.following) {
				let uid = s.currentUser.following[user].uid;
				usersUIDs.push(uid);
			}
			//create a function that grabs each user in following list from firebase and set up a resolve
			let searchFollowing = (uid) => {
				return new Promise((resolve, reject) => {
					fbRef.database().ref('users').orderByChild('uid').equalTo(uid).once('value').then(
							(snapshot) => {
								let result = snapshot.val(),
										uglyId = Object.keys(result)[0],
										user = result[uglyId];
								user.uglyId = uglyId;
								s.drinkingBuddies.push(user);
								resolve(user);
							}
						);					
				});	
			};			
			//iterate over your uid list and search for them within firebase
			//when that is finished, move on
			Promise.all(usersUIDs.map((uid) => searchFollowing(uid))).then(
					(status) => {	
						//for each user you are following, push their id into the uid array					
						s.drinkingBuddies.forEach((buddy) => {
							s.uidArray.push(buddy.uid);
						});
						s.$apply();
					}
				);		
		}
	};

	//watch for the s.currentUser to make a change to their profile.. 
	//In this case, their following list. If it changes, updates their following profile
	s.$watch(
		function() { return s.currentUser; },
		function(oldValue, newValue) { 
			if (oldValue !== newValue) {
				updateFollowingList(); 
			}	
		}
	);	

	//This is making an autocomplete for my popover. Im creating a list of all users from firebase
	//I should probably re-factor this to firebase's querying method.. but nah
	s.firebaseCallToUsers = () => {
		fbRef.database().ref('users').once('value').then(
				(snapshot) => {
					let myUsers = snapshot.val();
					//create a list of all available user-objects with specific search properties
					s.userSearch = [];					
					for (var user in myUsers) {
						let currentUser = myUsers[user],
								editedUser = {
									firstName: currentUser.firstName,
									lastName: currentUser.lastName,
									userName: currentUser.userName,
									uglyId: user 
								};						
						s.userSearch.push(editedUser);
					}
					s.$apply();					
				}
			);			 
	};

	//This updates your search popover to specific users from firebase based on input value
	s.updatePopover = (event) => {
		//grab input value
		let myInput = $(event.target).val();		
		if (myInput.length > 0) {
			//ng-repeat search in filteredSearches. 
			//s.filteredSearches is filtered based on user input and s.userSearch array
			s.filteredSearches = $filter('filter')(s.userSearch, myInput);			
			if (s.filteredSearches.length > 0) {
				s.drinkingBuddiesSearchPopover = '../../partials/BootstrapTemplates/DrinkingBuddiesSearchPopover.html';
			}
		}		
	};		

	//This function happens whenever you want to get mroe info on a selected user or their following/followed by
	//colloection changes or updates
	let updateSelectedUser = (selectedUser) => {
		return new Promise((resolve, reject) => {
			//Update input value
			$(".drinking-buddies-searchFriends").val(selectedUser.firstName);		
			//get your selected user's data from firebase
			fbRef.database().ref(`users/${selectedUser.uglyId}`).once('value').then(
				(firebaseUser) => {
					let updatedSelectedUser = firebaseUser.val();					
					//assign uglyId
					updatedSelectedUser.uglyId = selectedUser.uglyId;
					s.currentSearch = true;				
					resolve(updatedSelectedUser);
				}
			);
		});
	};	

	//After a user selects a friend, make another call to firebase to get that full user's info
	s.searchFriends = (selectedUser) => {			
		$(".drinking-buddies-searchFriends").val(selectedUser.firstName);		
		//make a call to firebase for the selected user 
		updateSelectedUser(selectedUser).then(
				(updatedSelectedUser) => {
					fbRef.database().ref('fieldJournal').orderByChild("uid").equalTo(updatedSelectedUser.uid).once("value").then(
						(snapshot) => {  					
	  					let fieldJournalEntries = snapshot.val();	  					
	  					//reset s.selectedUser
							s.selectedUser = updatedSelectedUser;
	  					//create a new array of fieldJournal entries, with the uglyId included and reversed 
	  					s.selectedUser.fieldJournal = Object.keys(fieldJournalEntries).reverse().map((entry) => {
	  						fieldJournalEntries[entry].uglyId = entry;
	  						return fieldJournalEntries[entry];
	  					});  					  					  						  						  				
	  					s.$apply();
  				});
				}
			);		
	};	
	
	//when you choose to follow a specific user
	s.followUser = (selectedUser) => {
		//get a reference for the keys you will be creating
		let updates = {},
				selectedUserFollowedByKey = fbRef.database().ref('users').child(selectedUser.uglyId).child('followed_by').push().key,
				currentUserFollowingKey 	= fbRef.database().ref('users').child(s.currentUser.uglyId).child('following').push().key;

		//set up your update objects for both current user and selected user
		updates[`/users/${selectedUser.uglyId}/followed_by/${selectedUserFollowedByKey}`] = {'uid': s.currentUser.uid};
		updates[`/users/${s.currentUser.uglyId}/following/${currentUserFollowingKey}`] 	= {'uid': selectedUser.uid};
		
		//Update your database
		fbRef.database().ref().update(updates).then(
				() => {	
					//Update selectedUser
					updateSelectedUser(selectedUser).then(
							(updateSelectedUser) => {								
								//Reset your s.selectedUser and s.selectedUser.fieldJournal
								s.selectedUser = updateSelectedUser;
								s.selectedUser.fieldJournal = selectedUser.fieldJournal;								
								s.$apply();
							}
						);					
				}
			);							
	};

	s.showBuddyInfo = (buddy) => {		
		s.selectFollower = true;
		s.selectedUser = buddy;		
		//make a call to firebase to get selected users's field Journal entries
		fbRef.database().ref('fieldJournal').orderByChild('uid').equalTo(buddy.uid).once('value').then(
				(snapshot) => {
					let fieldJournal = snapshot.val();	
					//reset your selecteduser's fieldJournal Array
					s.selectedUser.fieldJournal = Object.keys(fieldJournal).reverse().map((entry) => {
						fieldJournal[entry].uglyId = entry;
						return fieldJournal[entry];																
					});
					s.$apply();
				}
			);
	};

	//This is to reset scope variables so that things refresh
	s.resetSearchInput = () => {
		$(".drinking-buddies-searchFriends").val('');
		s.selectedUser = {};
		s.currentSearch = null;
	};

	//Takes you back to your friendsList view
	s.backToDisplayAllView = () => s.selectFollower = false;			

});

