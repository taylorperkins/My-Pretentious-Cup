"use strict";

console.log("HomeCtrl.js is connected");

app.controller("HomeCtrl", function($scope, AuthUserFactory, $sce, GoogleMapsConfig) {
	let s = $scope;

	// s.googleMapsUrl = 		$sce.trustAsResourceUrl(GoogleMapsConfig.googleMapsUrl);
	// s.googleLibraryPlaces = 	$sce.trustAsResourceUrl(GoogleMapsConfig.googleLibraryPlaces);
	

	console.log("HomeCtrl.js is working");

	s.logout = () => AuthUserFactory.logoutUser();

});