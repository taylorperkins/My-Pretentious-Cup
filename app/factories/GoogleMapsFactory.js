"use strict";

app.factory("GoogleMapsFactory", function($http, $sce, GoogleMapsConfig) {

	//When passing in a param as the userInput, act as though 'https://maps.googleapis.com/maps/api/'
	//is the base of the request, and format your userInput to match the string after this. 
	//I have created a proxy server outside this repo to act as the middleman to gain access
	//to this API. 
	//I am using Heroku as the middleman to get the request I want. 

	//Thanks to Blaise Roberts --> https://github.com/BlaiseRoberts/proxy-server							
	let GoogleMapsRequest = () => $http.get("https://my-pretentious-cup.herokuapp.com/api/googleMaps/js?key=AIzaSyAhT4ILSuATDfD9y1k5Sx7HZNITgHj5e3U&libraries=places");

	//Args: 
	//	userInput: string search result
	//	LatLngCoords : {lat: '', lng: ''}
	//Resolves with top 5 predictions from google maps autocompete
	let GoogleMapsAutoComplete = (userInput, LatLngCoords) => $http.get(`https://my-pretentious-cup.herokuapp.com/api/googleMaps/place/autocomplete/json?input=${userInput}&types=establishment&location=${LatLngCoords.lat},${LatLngCoords.lng}&radius=1000&key=AIzaSyAhT4ILSuATDfD9y1k5Sx7HZNITgHj5e3U`);		

	return {
		GoogleMapsRequest,
		GoogleMapsAutoComplete,
	};
});
