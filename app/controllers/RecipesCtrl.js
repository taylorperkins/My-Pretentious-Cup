"use strict";

console.log("RecipesCtrl.js is connected");

app.controller("RecipesCtrl", function($scope, pages) {
	let s = $scope;

	s.pages = pages;

	s.changeViews = (view) => {
		s.subPage = view;
	};

	console.log("RecipesCtrl.js is working");

		
});