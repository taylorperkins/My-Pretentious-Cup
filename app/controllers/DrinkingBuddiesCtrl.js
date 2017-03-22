


"use strict";

console.log("DrinkingBuddiesCtrl.js is connected");

app.controller("DrinkingBuddiesCtrl", function($scope, $sce, fbRef, $filter, TransferDataFactory, drinkingBuddiesCoords) {
	let s = $scope;
	console.log("DrinkingBuddiesCtrl.js is working");

	s.currentSearch = false;

	//This is an array that contains all possible searches for a user
	s.userSearch = [];

	s.firebaseCallToUsers = () => {
		fbRef.database().ref('users').once('value').then(
				(snapshot) => {
					let myUsers = snapshot.val();
					s.userSearch = [];
					console.log(myUsers);
					for (var user in myUsers) {

						let currentUser = myUsers[user];

						let editedUser = {
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
		$("#drinking-buddies-searchFriends").val(filteredFriend.firstName);		
		fbRef.database().ref(`users/${filteredFriend.uglyId}`).once('value').then(
				(snapshot) => {
					console.log("Here is your selected user: ", snapshot.val());
					s.selectedUser = snapshot.val();
					var ref = fbRef.database().ref('fieldJournal');
					ref.orderByChild("uid").equalTo(s.selectedUser.uid).on("value", function(snapshot) {
  					console.log("Here is a snapshot of the user's fieldJournal entries: ", snapshot.val());
  					let fieldJournalEntries = snapshot.val();
  					s.selectedUser.fieldJournal = [];
  					for (var entry in fieldJournalEntries) {
  						fieldJournalEntries[entry].uglyId = entry;
  						s.selectedUser.fieldJournal.push(fieldJournalEntries[entry]);
  					}
  					console.log("Here is your selected user with field journal entries: ", s.selectedUser);
  					s.currentSearch = true;
  					s.$apply();
  				});
				}
			);
	};

	s.sendCoordsToGlobeView = (selectedCoords) => drinkingBuddiesCoords.Coords = selectedCoords;			

});





















				// if ($("#drinking-buddies-searchFriends").popover()) $("#drinking-buddies-searchFriends").popover("destroy");

				// $( "#drinking-buddies-searchFriends" ).popover({
				// 				html: true, 
				// 				animation: true, 
				// 				placement: "bottom", 
				// 				template: '',
				// 				content: "<div ng-repeat='user in filteredSearches' ng-click='searchFriends(user)'>Name: {{user.firstName}} {{user.lastName}}</div>"
				// 			});
				// 		// .parent().on('click', '#location-popover', function() {
				// 		// 	$("#drinking-buddies-searchFriends").val(s.predictions[0].description);
				// 		// 	$("#drinking-buddies-searchFriends").popover("destroy");
				// 		// 	s.logSelectedLocation(s.predictions[0]);
				// 		// }); 
				// $( "#drinking-buddies-searchFriends" ).popover("show");
