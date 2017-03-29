"use strict";

console.log("FieldJournalDetailedPicModalCtrl.js is connected");

app.controller("FieldJournalDetailedPicModalCtrl", function($scope, fieldJournalEntry) {
	console.log("FieldJournalDetailedPicModalCtrl.js is working, and here is my entry: ", fieldJournalEntry);
	let s = $scope;
	s.entry = fieldJournalEntry;
	

});





