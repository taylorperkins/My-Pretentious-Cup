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

var app = angular.module("MyPretentiousCup", ['ui.router', 'ui.validate', 'ui.bootstrap'])

.service('fbRef', function(FBCreds) {
	return firebase.initializeApp(FBCreds);
})

.config(function($stateProvider, $urlRouterProvider) {

				console.log("I am within the config");

				$urlRouterProvider.otherwise('/login');

				// HOME STATES AND NESTED VIEWS ========================================

				$stateProvider

					.state('landing', {
						url: '/landing',
						template: 
							'<div class="container">' +
								'<div ui-view></div>' +
							'</div>',
						controller: "LandingCtrl"			      		           
			  	})
					.state('landing.login', {
            url: '^/login',
            templateUrl: '../partials/Login.html',
            controller: "LoginCtrl"
					})
					.state('landing.register', {
						url: '^/register',
            templateUrl: '../partials/Register.html',
            controller: "RegisterCtrl"
					})
					.state('home', {			
						url: '/home',
						resolve: {
							pages: function() {
								return {
									'newFieldJournal': '../partials/NewFieldJournal.html',
									'listFieldJournal': '../partials/ListFieldJournal.html',
									'newRecipes': '../partials/NewRecipes.html',
									'listRecipes': '../partials/ListRecipes.html'								
								};							
							}							
						},						
						views: {
							"": { 
								templateUrl: 'partials/Home.html',
								controller: "HomeCtrl"
							},
              "main@home": { 
              	templateUrl: 'partials/Main.html',
              	controller: "MainCtrl"              	
              },
              "fieldJournal@home": {
              	url: '/fieldJournal',
              	templateUrl: 'partials/FieldJournal.html',
              	controller: "FieldJournalCtrl"
              },              
              "recipes@home": {
              	templateUrl: 'partials/Recipes.html',
              	controller: "RecipesCtrl"
              },
              "drinkingBuddies@home": {
              	templateUrl: 'partials/DrinkingBuddies.html',
              	controller: "DrinkingBuddiesCtrl"
              },
              "globeView@home": {
              	templateUrl: 'partials/GlobeView.html',
              	controller: "GlobeViewCtrl"
              }
            }						
					})      		   		       
	        .state('sample', {
	        	url: '/sampleView',
	        	templateUrl: '../partials/Sample.html',
	        	controller: "SampleCtrl"		        				        
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
	console.log(google);
});
















