"use strict";

console.log("GoogleMapsFactory.js is connected");

app.factory("GoogleMapsFactory", function($http, $sce, GoogleMapsConfig) {

	//When passing in a param as the userInput, act as though 'https://maps.googleapis.com/maps/api/'
	//is the base of the request, and format your userInput to match the string after this. 
	//I have created a proxy server outside this repo to act as the middleman to gain access
	//to this API. 
	//I am using Heroku as the middleman to get the request I want. 

	//Thanks to Blaise Roberts --> https://github.com/BlaiseRoberts/proxy-server							

	let GoogleMapsRequest = () => $http.get("https://my-pretentious-cup.herokuapp.com/api/googleMaps/js?key=AIzaSyDePd5ts_xkK8JsFIkJnUs60rqG5nTgg2g&libraries=places");

	// userInput should be a string search result, and LatLngCoord should be an obj: {lat: '', lng: ''}
	let GoogleMapsAutoComplete = (userInput, LatLngCoord) => $http.get(`https://my-pretentious-cup.herokuapp.com/api/googleMaps/place/autocomplete/json?input=${userInput}&types=establishment&location=${LatLngCoord.lat},${LatLngCoord.lng}&radius=1000&key=AIzaSyDePd5ts_xkK8JsFIkJnUs60rqG5nTgg2g`);

	let createMarkerContent = (results, status) => {
		return new Promise((resolve, reject) => {
			let myUpdatedresults = [];
			if (status == google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		    	let newResult = {},		      
		          myLatLng = {lat: results[i].geometry.location.lat(), lng: results[i].geometry.location.lng()},							  		      
		          mySearch = results[i],						
				      contentString = 
					  		'<div class="content">'+			      
					      	`<h1 class="firstHeading" class="firstHeading">${mySearch.name}</h1>`+
					      	'<div class="bodyContent">'+
					      		`<p><b>${mySearch.name}</b>` +
					  				`<image src="${mySearch.icon}">` +
					      		'(last visited June 22, 2009).</p>'+
					      	'</div>'+
					      '</div>';


			    newResult = { myLatLng, mySearch, contentString };
			    myUpdatedresults.push(newResult);				  
		    }
			}
			resolve(myUpdatedresults);
		});
	};

	return {
		GoogleMapsRequest,
		GoogleMapsAutoComplete,
		createMarkerContent		
	};
});
