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

var app = angular.module("MyPretentiousCup", ['ui.router'])

.service('fbRef', function(FBCreds) {
	return firebase.initializeApp(FBCreds);
})

.config(function($stateProvider, $urlRouterProvider) {

				console.log("I am within the config");

				$stateProvider
        
		        // HOME STATES AND NESTED VIEWS ========================================
		        .state('root', {
			        	url: '/',
		            templateUrl: '../partials/Root.html',
		            controller: "RootCtrl"	        
		        })
		        .state('login', {
		            url: '/login/{a}/{b}',
		            templateUrl: '../partials/Login.html',
		            controller: "LoginCtrl"
		        })
		        .state('register', {
		            url: '/register',
		            templateUrl: '../partials/Register.html',
		            controller: "RegisterCtrl"
		        })
		        .state('sample', {
		        	url: '/sampleView',
		        	templateUrl: '../partials/Sample.html',
		        	controller: "SampleCtrl"		        				        
		        })
		        .state('home', {
		            url: '/home',
		            templateUrl: '../partials/Home.html',
		            controller: "HomeCtrl"
		        })
		        .state('fieldJournal', {
		            url: '/field-journal',
		            templateUrl: '../partials/FieldJournal.html',
		            controller: "FieldJournalCtrl"
		        })
		        .state('newFieldJournal', {
		        	url: '/field-journal/new',
		        	templateUrl: '../partials/NewFieldJournal.html',
		        	controller: "NewFieldJournalCtrl"
		        })
		        .state('listFieldJournal', {
		        	url: '/field-journal/list',
		        	templateUrl: '../partials/ListFieldJournal.html',
		        	controller: "ListFieldJournalCtrl"
		        })
		        .state('recipes', {
		            url: '/recipes',
		            templateUrl: '../partials/Recipes.html',
		            controller: "RecipesCtrl"
		        })
		        .state('newRecipes', {
		        	url: '/recipes/new',
		        	templateUrl: '../partials/NewRecipes.html',
		        	controller: "NewRecipesCtrl"
		        })
		        .state('listRecipes', {
		        	url: '/recipes/list',
		        	templateUrl: '../partials/ListRecipes.html',
		        	controller: "ListRecipesCtrl"
		        })
		        .state('drinkingBuddies', {
		            url: '/drinking-buddies',
		            templateUrl: '../partials/DrinkingBuddies.html',
		            controller: "DrinkingBuddiesCtrl"
		        })
		        .state('globeView', {
		            url: '/globe-view',
		            templateUrl: '../partials/GlobeView.html',
		            controller: "GlobeViewCtrl"
		        })
		        .state('notARoute', {
		        	url: '*path',
		        	template: function($location, $scope) {
		        		alert("I'm sorry, but the route you have chosen is not available. We're sending you back to your most rpevious page to try again!");		      
		        		$window.history.back();
		        	}
		        });

	
})

.run((fbRef) => {
	console.log("You are connected");
	fbRef.database().ref('users').once('value').then(
			(snapshot) => console.log(snapshot.val())
		);
});













