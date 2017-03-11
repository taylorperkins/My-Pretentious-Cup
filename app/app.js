"use strict";
console.log("App.js is connected!");

/*
An Angular application designed to allow users the ability to create a 
field journal of drink experiences. 

The app will attach to firebase to store all of the user's information.
The user's information will include:
	
		Field Journal,
		Recipes Information,
		Personal Information,
		Ratings and Reviews for specific Locations
*/

var app = angular.module("MyPretentiousCup", ['ui.router', 'ui.router.stateHelper'])

.service('fbRef', function(FBCreds) {
	return firebase.initializeApp(FBCreds);
})

.config(function($stateProvider, $urlRouterProvider, stateHelperProvider) {

				console.log("I am within the config");

				$urlRouterProvider.otherwise('/landing');

				stateHelperProvider
        
		        // HOME STATES AND NESTED VIEWS ========================================
		        .state({
		        	name: 'landing', 
	            templateUrl: '../partials/Landing.html',
	            controller: "LandingCtrl",
	            children : [
	            	{
	            		name: 'login',
	            		templateUrl: '<ui-view />'
	            	}
	            ]
		        	
		        
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
		        });

	
})

.run((fbRef) => {
	console.log("You are connected");
	fbRef.database().ref('users').once('value').then(
			(snapshot) => console.log(snapshot.val())
		);
});













