"use strict";

console.log("MainCtrl.js is connected");

app.controller("MainCtrl", function($scope, fbRef) {
	console.log("MainCtrl.js is working");
	let s = $scope;

	s.newsfeed = true;
	s.fieldJournalEntries = [];

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

});






