
"use strict";

console.log("DrinkingBuddiesCtrl.js is connected");

app.controller("DrinkingBuddiesCtrl", function($scope, $sce, fbRef, $filter, $uibModal, TransferDataFactory, drinkingBuddiesCoords, UserStorageFactory) {
	let s = $scope;
	console.log("DrinkingBuddiesCtrl.js is working");

	s.currentSearch = false;
	s.selectFollower = false;
	s.drinkingBuddiesListReusable = '../../partials/Reusables/DrinkingBuddiesList.html';
	s.drinkingBuddiesEntryDisplay = '../../partials/DrinkingBuddiesEntryDisplay.html';
	s.drinkingBuddies = [];
	s.uidArray = [];

	console.log("This is referencing HomeCtrl.js from DrinkingBuddiesCtrl.js: ", s.currentUser);

	//This is an array that contains all possible searches for a user
	s.userSearch = [];

	let updateFollowingList = () => {

		s.drinkingBuddies = [];
		s.uidArray = [];

		if (s.currentUser.hasOwnProperty('following')) {
			console.log(s.currentUser.following);
			let usersUIDs = [];
			for (var user in s.currentUser.following) {
				let uid = s.currentUser.following[user].uid;
				usersUIDs.push(uid);
			}
			let searchFollowing = (uid) => {
				return new Promise((resolve, reject) => {
					fbRef.database().ref('users').orderByChild('uid').equalTo(uid).once('value').then(
							(snapshot) => {
								let result = snapshot.val(),
										uglyId = Object.keys(result)[0],
										user = result[uglyId];
								user.uglyId = uglyId;
								s.drinkingBuddies.push(user);
								resolve();
							}
						);					
				});	
			};

			s.drinkingBuddies = [];
			Promise.all(usersUIDs.map((uid) => searchFollowing(uid))).then(
					(status) => {
						console.log("Your Promise.all should be finished: ", status);
						console.log("Here are your drinkingBuddies: ", s.drinkingBuddies);
						s.drinkingBuddies.forEach((buddy) => {
							s.uidArray.push(buddy.uid);
						});
						s.$apply();
					}
				);		
		}
	};

	s.$watch(
		function() { return s.currentUser; },
		function(oldValue, newValue) { 
			if (oldValue !== newValue) {
				updateFollowingList(); 
			}	
		}
	);

	//Take firebase friendsList obj and turns it into an arrayit
	let transposeFriendsList = (friendsListObj) => {
		s.selectedUser.friendsListArr = [];
		for (var friend in friendsListObj) {
			let uglyId = friend;
			friendsListObj[uglyId].uglyId = uglyId;
			s.selectedUser.friendsListArr.push(friendsListObj[uglyId]);
		}
		return s.selectedUser.friendsListArr;
	};

	s.firebaseCallToUsers = () => {
		fbRef.database().ref('users').once('value').then(
				(snapshot) => {
					let myUsers = snapshot.val();
					s.userSearch = [];
					console.log(myUsers);
					for (var user in myUsers) {
						let currentUser = myUsers[user],
								editedUser = {
									firstName: currentUser.firstName,
									lastName: currentUser.lastName,
									userName: currentUser.userName,
									uglyId: user 
								};						
						s.userSearch.push( editedUser);
					}
					s.$apply();
					console.log(s.userSearch);
				}
			);			 
	};

	s.updatePopover = (event) => {
		let myInput = $(event.target).val();
		console.log("Here's your input value: ", myInput);
		if (myInput.length > 0) {
			s.filteredSearches = $filter('filter')(s.userSearch, myInput);
			console.log("Here are your filtered searches: ", s.filteredSearches);
			if (s.filteredSearches.length > 0) {
				s.hey = '../../partials/BootstrapTemplates/DrinkingBuddiesSearchPopover.html';
			}
		}		
	};	

	//After a user selects a friend, make another call to firebase to get that full user's info
	s.searchFriends = (filteredFriend) => {		
		console.log(filteredFriend);	
		$(".drinking-buddies-searchFriends").val(filteredFriend.firstName);		
		fbRef.database().ref(`users/${filteredFriend.uglyId}`).once('value').then(
				(snapshot) => {
					console.log("Here is your selected user: ", snapshot.val());
					s.selectedUser = snapshot.val();		
					s.selectedUser.friendsList = transposeFriendsList(s.selectedUser.friendsList);
					var ref = fbRef.database().ref('fieldJournal');
					ref.orderByChild("uid").equalTo(s.selectedUser.uid).on("value", function(snapshot) {
  					console.log("Here is a snapshot of the user's fieldJournal entries: ", snapshot.val());
  					let fieldJournalEntries = snapshot.val();
  					s.selectedUser.fieldJournal = [];
  					for (var entry in fieldJournalEntries) {
  						fieldJournalEntries[entry].uglyId = entry;
  						s.selectedUser.fieldJournal.unshift(fieldJournalEntries[entry]);
  					}
  					console.log("Here is your selected user with field journal entries: ", s.selectedUser);
  					s.currentSearch = true;
  					s.$apply();
  				});
				}
			);
	};

	s.sendCoordsToGlobeView = (selectedCoords) => drinkingBuddiesCoords.Coords = selectedCoords;			

	s.followUser = (selectedUser) => {
		console.log("Here is your selected user! You want to be their friend: ", selectedUser);

		fbRef.database().ref('users').orderByChild('uid').equalTo(selectedUser.uid).once('value').then(
				(snapshot) => {
					console.log('here is your user from firebase: ', snapshot.val());
					console.log('here is your currentUser: ', s.currentUser);
					let FBSelectedUser = snapshot.val(),
							selectedUserKey = Object.keys(FBSelectedUser)[0],
							updates = {},
							selectedUserFollowedByKey = fbRef.database().ref('users').child(selectedUserKey).child('followed_by').push().key,
							currentUserFollowingKey = fbRef.database().ref('users').child(s.currentUser.ugly_id).child('following').push().key;
				
					updates[`/users/${selectedUserKey}/followed_by/${selectedUserFollowedByKey}`] = {'uid': s.currentUser.uid};
					updates[`/users/${s.currentUser.ugly_id}/following/${currentUserFollowingKey}`] = {'uid': FBSelectedUser[selectedUserKey].uid};

					fbRef.database().ref().update(updates);
					fbRef.database().ref('users').once('value').then(
							(snapshot) => s.searchFriends({firstName: selectedUser.firstName, uglyId: selectedUserKey})					
						);
				}
			);
	};

	s.showBuddyInfo = (buddy) => {
		console.log("Here is your buddie's info: ", buddy);
		s.selectFollower = true;
		s.selectedUser = buddy;
		s.selectedUser.fieldJournal = [];

		fbRef.database().ref('fieldJournal').orderByChild('uid').equalTo(buddy.uid).once('value').then(
				(snapshot) => {
					let fieldJournal = snapshot.val();	
					console.log(fieldJournal);
					for (var entry in fieldJournal) {
						s.selectedUser.fieldJournal.unshift(fieldJournal[entry]);
					}
					s.$apply();
				}
			);
	};

	s.resetSearchInput = () => {
		$(".drinking-buddies-searchFriends").val('');
		s.selectedUser = {};
	};

	s.backToDisplayAllView = () => {
		s.selectFollower = false;		
	};

	s.openMapModal = (selectedCoords) => {
		console.log("Here are your selected coords: ", selectedCoords);	
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'drinkingBuddies-modal-title',
      ariaDescribedBy: 'drinkingBuddies-modal-body',
      templateUrl: '../../partials/DrinkingBuddiesMapModal.html',      
      controller: 'DrinkingBuddiesMapModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".drinkingBuddies-modal-parent"),  
      resolve: {
      	locationCoordsPlaceId: function() {      		
      		return selectedCoords;
      	},
      	currentLocationCoords: function() {
      		let lat = UserStorageFactory.getUserCurrentLocation().lat,
      				lng = UserStorageFactory.getUserCurrentLocation().lng,
      				currentLocation = {
      					lat, lng
      				};
      		return currentLocation;
      	}
      }
    }); 

    modalInstance.result.then(function (selectedItem) {
      s.selected = selectedItem;
    }, function () {
      console.log("Dismissed");
    });

	};

});

