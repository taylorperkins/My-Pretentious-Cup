"use strict";

console.log("RecipesCtrl.js is connected");

app.controller("RecipesCtrl", function($scope) {
	let s = $scope;

	s.pages = {
		newEntry: '../partials/NewRecipes.html',
		listEntry: '../partials/ListRecipes.html'
	};

	s.changeViews = (view) => {
		s.subPage = view;
	};

	console.log("RecipesCtrl.js is working");

		
});