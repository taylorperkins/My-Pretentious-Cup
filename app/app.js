"use strict";
console.log("App.js is connected!");

/*
An Angular Application that allows users to create, save, edit, and delete notes
Each user wil have their own separate database within Firebase
There are 4 different screen displays
	1. Login
	2. Register
	3. List All Notes
	4. Create New Notes

Each page has a controller directly related to it.
*/

var app = angular.module("MyPretentiousCup", [
	'ui.router',
	'ngMaterial'
]);

app.config(function($stateProvider, $urlRouterProvider) {

				$urlRouterProvider.otherwise('/home');

				$stateProvider
        
		        // HOME STATES AND NESTED VIEWS ========================================
		        .state('landing', {
		            url: '/landing',
		            templateUrl: '../partials/Landing.html',
		            controller: "LandingCtrl"
		        })
		        .state('login', {
		            url: '/login',
		            templateUrl: '../partials/Login.html',
		            controller: "LoginCtrl"
		        })
		        .state('register', {
		            url: '/register',
		            templateUrl: '../partials/Register.html',
		            controller: "RegisterCtrl"
		        })
		        .state('home', {
		            url: '/home',
		            templateUrl: '../partials/Home.html',
		            controller: "HomeCtrl"
		        })
		        .state('field-journal', {
		            url: '/field-journal',
		            templateUrl: '../partials/FieldJournal.html',
		            controller: "FieldJournalCtrl"
		        })
		        .state('recipes', {
		            url: '/recipes',
		            templateUrl: '../partials/Recipes.html',
		            controller: "RecipesCtrl"
		        })
		        .state('drinking-buddies', {
		            url: '/drinking-buddies',
		            templateUrl: '../partials/DrinkingBuddies.html',
		            controller: "DrinkingBuddiesCtrl"
		        })
		        .state('globe-view', {
		            url: '/globe-view',
		            templateUrl: '../partials/GlobeView.html',
		            controller: "GlobeViewCtrl"
		        })
	
});

app.run(() => {
	console.log("You are connected");
});













