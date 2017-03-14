"use strict";

console.log("FieldJournalCtrl.js is connected");

app.controller("FieldJournalCtrl", function($scope) {
	let s = $scope;

	s.pages = {
		newEntry: '../partials/NewFieldJournal.html',
		listEntry: '../partials/ListFieldJournal.html'
	};

	s.changeViews = (myString) => {
		console.log(myString);
		s.subPage = myString;
	};

	console.log("FieldJournalCtrl.js is working");

		
});