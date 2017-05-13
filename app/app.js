"use strict";

/*
An Angular application designed to allow users the ability to create a 
field journal of drink experiences, as well as display them 
to other users. 

The app will attach to firebase to store all of the user's information.
The user's information will include:
	
		Field Journal,		
		Personal Information,
		Ratings and Reviews for specific locations
*/


//This determines whether or not a user is signed up and logged in through firebase. If not, they are rejected and
//sent back to the login page
let isAuth = (AuthUserFactory, $location) => new Promise ((resolve, reject) => {
	AuthUserFactory.isAuthenticated()
		.then((userExists) => {		
			if (userExists) {				
				resolve(userExists);
			} else {				
				$location.path('/login');
				reject();
			}
		});
});

var app = angular.module("MyPretentiousCup", ['ui.router', 'ui.validate', 'ui.bootstrap', 'd3', 'angular-img-cropper', 'rzModule'])

//Initializes fbRef as your overall Firebase obj. I refer to this whenever I want to 
//alter or reference my database
.service('fbRef', function(FBCreds) {
	return firebase.initializeApp(FBCreds);
})
//This gets changed when you create or edit your senses using the d3 tasting wheel
.service('fieldJournalWheel', function() {
	this.Sense = {};
})
//This is used as an autocomplete request to google maps api and returns a data obj which produces predictions
//based off of your userinput and LatLngCoords obj
.service('GooglePlacesAutoComplete', function(GoogleMapsConfig, $http) {
	this.search = (userInput, LatLngCoords) => $http.get(`https://my-pretentious-cup.herokuapp.com/api/googleMaps/place/autocomplete/json?input=${userInput}&types=establishment&location=${LatLngCoords.lat},${LatLngCoords.lng}&radius=1000&key=${GoogleMapsConfig.googlePlacesAPIKey}`);			
})

//This controller wraps the <head> tags. The only purpose is to dynamically inject
//Google Maps Api Key into the <script> tag src attribute
.controller('HandleGoogleMapsRequest', function($scope, $sce, GoogleMapsConfig) {
	$scope.GoogleMapsApiRequest = $sce.trustAsResourceUrl(`https://my-pretentious-cup.herokuapp.com/api/googleMaps/js?key=${GoogleMapsConfig.googlePlacesAPIKey}&libraries=places&`);	
})

.config(function($stateProvider, $urlRouterProvider, GoogleMapsConfig) {
				
	$urlRouterProvider.otherwise('/login');

	// HOME STATES AND NESTED VIEWS ========================================

	$stateProvider

	//'landing' state handles both login and register pages
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

	//'home' state handles everything else. 
	//This includes 'home'-wrapper, 'main', 'drinkingBuddies', and 'fieldJournal' views
	.state('home', {			
		url: '/home',
		resolve: {
			isAuth,
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
                 "drinkingBuddies@home": {
	              	templateUrl: 'partials/DrinkingBuddies.html',
	              	controller: "DrinkingBuddiesCtrl"
			}            
           }						
	})      		   		       
        
      //This handles whether or not a user is on a correct path I have pre-defined. If not,
      //they are sent back to the most previos page they visited        
      .state('notARoute', {
        	url: '*path',
        	template: function($scope) {
        		alert("I'm sorry, but the route you have chosen is not available. We're sending you back to your most rpevious page to try again!");		              		
        	},
        	controller: function ($location) {	           
	           $location.path('/login');
	      }
      });
})

.run(() => {	

	/*
		I am choosing to leave this section for development later on
	*/

	// var client = new twilio.RestClient(TwilioCreds.accountSid, TwilioCreds.authToken);
	// client.messages.create({
	//     body: 'Hello from Node',
	//     to: '',  // Text this number
	//     from: TwilioCreds.accountPhoneNumber // From a valid Twilio number
	// }, function(err, message) {
	//     console.log(message.sid);
	// });

});

