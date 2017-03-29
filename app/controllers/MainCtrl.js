"use strict";

console.log("MainCtrl.js is connected");

app.controller("MainCtrl", function($scope, $uibModal, fbRef, UserStorageFactory) {
	console.log("MainCtrl.js is working");
	let s = $scope;

	s.newsfeed = true;
	s.fieldJournalEntries = [];
	s.reader = new FileReader();

	let updateFieldJournalEntries = (databaseSnapshot) => {
		console.log("Your database was updated: ");
		console.log("databaseSnapshot: ", databaseSnapshot);
		for (var entry in databaseSnapshot) {
			s.fieldJournalEntries.unshift(databaseSnapshot[entry]);
		}	
		console.log("s.fieldJournalEntries: ", s.fieldJournalEntries);
	};
	var fieldNotesRef = fbRef.database().ref('fieldJournal/');
	fieldNotesRef.on('value', function(snapshot) {
	  updateFieldJournalEntries(snapshot.val());
	});

	let user = UserStorageFactory.getCurrentUserInfo();
	console.log(user);
	s.currentUser = user[Object.keys(user)[0]];
	console.log(s.currentUser);

	
	s.newsFeedView = () => {
		s.newsfeed = true;
		s.selectedFieldNote = null;
	};

	s.showFieldNote = (selectedFieldNote) => {
		console.log("Selected from main.ctrl: ", selectedFieldNote);
		s.newsfeed = false;
		s.selectedFieldNote = selectedFieldNote;
	};

	s.imConnected = () => {
		console.log("I am here");
	};

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

});






