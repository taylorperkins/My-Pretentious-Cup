"use strict";

console.log("FieldJournalCtrl.js is connected");

app.controller("FieldJournalCtrl", function($scope, pages) {
	let s = $scope;
	console.log("FieldJournalCtrl.js is working");
	
	s.pages = pages;
	s.category = 'Coffee';

	s.newDrink = {
		title: '', 
		location: '',
		dateCreated: Date.now(),
		category: s.category, 
		rating: '', 
		remainingNotes: '',
		public: true		
	};

	s.drinkForm = `partials/drink-forms/${s.category}Form.html`;

	s.subPage = 'newFieldJournal';

	s.coffeeStyles = ['Latte', 'Macchiato', 'Cortado', 'Flat White', 'Espresso', 'Cappucino'];
	s.coffeeMethods = ['Drip', 'French Press', 'Cold Brew'];

	console.log(s.pages);

	s.changeViews = (myString) => {
		console.log(myString);
		s.subPage = myString;
	};

	s.newFieldJournalEntry = () => {
		console.log("Here is your drink entry: ", s.newDrink);		
		// HandleFBDataFactory.postNewItem(s.newDrink);
	};

		
});