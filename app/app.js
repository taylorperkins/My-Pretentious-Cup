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

var app = angular.module("MyPretentiousCup", [
						'ui.router',
						'ngMaterial'
])

.service('fbRef', function(FBCreds) {
	return new Firebase(FBCreds.databaseURL);
})

.service('fbAuth', function($q, $firebase, $firebaseAuth, fbRef) {
				var auth;
				return function() {
					if (auth) return $q.when(auth);
					var authObj = $firebaseAuth(fbRef);
					if (authObj.$getAuth()) {
						return $q.when(auth = authObj.$getAuth());
					}

					var deferred = $q.defer();
					authObj.$authAnonymously().then(function(authData) {
							auth = authData;
							console.log(authData);
							deferred.resolve(authData);
					});
					return deferred.promise;
				};
})

.config(function($stateProvider, $urlRouterProvider) {

				console.log("I am within the config");

				var checkIfAuth = {
					projects: function(fbAuth) {
						return fbAuth();
					}
				};

				$urlRouterProvider.otherwise('/landing');

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
		            controller: "HomeCtrl",
		            resolve: {checkIfAuth}
		        })
		        .state('field-journal', {
		            url: '/field-journal',
		            templateUrl: '../partials/FieldJournal.html',
		            controller: "FieldJournalCtrl",
		            resolve: {checkIfAuth}
		        })
		        .state('recipes', {
		            url: '/recipes',
		            templateUrl: '../partials/Recipes.html',
		            controller: "RecipesCtrl",
		            resolve: {checkIfAuth}
		        })
		        .state('drinking-buddies', {
		            url: '/drinking-buddies',
		            templateUrl: '../partials/DrinkingBuddies.html',
		            controller: "DrinkingBuddiesCtrl",
		            resolve: {checkIfAuth}
		        })
		        .state('globe-view', {
		            url: '/globe-view',
		            templateUrl: '../partials/GlobeView.html',
		            controller: "GlobeViewCtrl",
		            resolve: {checkIfAuth}
		        });

	
})

.run(() => {
						console.log("You are connected");
});













