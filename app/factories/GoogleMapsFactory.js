"use strict";

console.log("GoogleMapsFactory.js is connected");

app.factory("GoogleMapsFactory", function($http, $sce, GoogleMapsConfig) {




	//When passing in a param as the userInput, act as though 'https://maps.googleapis.com/maps/api/'
	//is the base of the request, and format your userInput to match the string after this. 
	//I have created a proxy server outside this repo to act as the middleman to gain access
	//to this API. 
	//I am using Heroku as the middleman to get the request I want. 

	//Thanks to Blaise Roberts --> https://github.com/BlaiseRoberts/proxy-server

	let GoogleMapsRequest = (userInput) => {
		$http.get(`https://my-pretentious-cup.herokuapp.com/api/googleMaps/place/autocomplete/json?input=${userInput}&types=geocode&key=AIzaSyCBar6MbuEXMh-gwhp26Mncgg0Tk-HlsJM`).then(
				(response) => console.log(response.data)
			);
	};

	// let GoogleLibraryPlaces = () => {

	// }


	return {
		GoogleMapsRequest
	};

});
