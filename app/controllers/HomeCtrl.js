"use strict";

console.log("HomeCtrl.js is connected");

app.controller("HomeCtrl", function($scope, $sce, AuthUserFactory, GoogleMapsConfig, fbRef) {
	let s = $scope;
	
	console.log("HomeCtrl.js is working");

	s.logout = () => AuthUserFactory.logoutUser();

});