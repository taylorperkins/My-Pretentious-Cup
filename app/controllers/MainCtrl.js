"use strict";

console.log("MainCtrl.js is connected");

app.controller("MainCtrl", function($scope, $uibModal, fbRef, UserStorageFactory) {
	console.log("MainCtrl.js is working");
	let s = $scope;

	s.newsfeed = true;
	s.fieldJournalEntries = [];
	s.newsFeedDetails = '../../partials/NewsFeedDetails.html';
	s.reader = new FileReader();

	let updateFieldJournalEntries = (databaseSnapshot) => {
		console.log("Your database was updated: ");
		console.log("databaseSnapshot: ", databaseSnapshot);
		s.fieldJournalEntries = [];
		for (var entry in databaseSnapshot) {
			s.fieldJournalEntries.unshift(databaseSnapshot[entry]);
		}	
		console.log("s.fieldJournalEntries: ", s.fieldJournalEntries);
	};
	var fieldNotesRef = fbRef.database().ref('fieldJournal/');
	fieldNotesRef.on('value', function(snapshot) {
	  updateFieldJournalEntries(snapshot.val());
	});

	console.log("here is my current user: ", s.currentUser);
	
	s.newsFeedView = () => {
		s.newsfeed = true;
		s.selectedFieldNote = null;
	};

	s.imConnected = () => console.log("I am here");

	s.changeProfilePicture = () => {
		console.log("Here is where you should change your user's profile pic!");    
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/ProfilePicModal.html',      
      controller: 'ProfilePicCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".modal-profile-pic"),  
      resolve: {
      	user: function() {
      		let user = UserStorageFactory.getCurrentUserInfo(),
      				uglyId = Object.keys(user)[0];
      		user = user[uglyId];
      		user.ugly_id = uglyId;
      		return user;
      	}
      }
    }); 

    modalInstance.result.then(function (selectedItem) {
      s.selected = selectedItem;
    }, function () {
      console.log("Dismissed");
    });
	};

	s.showFieldNote = (entry, event) => {
		console.log("Selected from main.ctrl: ", entry);
		// s.newsfeed = false;
		// s.selectedFieldNote = selectedFieldNote;

  	if ($(event.target).hasClass('newsfeed-entry-location')) return;

    var modalInstance = $uibModal.open({
      animation: true,      
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/FieldJournalDetailedPicModal.html',      
      controller: 'FieldJournalDetailedPicModalCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".detailedEntry-modal-parent"),  
      resolve: {
      	fieldJournalEntry: function() {      		
      		return entry;
      	},
      	currentLocation: function() {
      		return s.currentLocation;
      	},
      	fieldJournalGooglePlacesRequest: function() {
      		return s.GooglePlacesRequest;
      	},
      	slider: function() {
      		return s.slider1;
      	},
      	location: function() {
      		return false;
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






