"use strict";

console.log("HomeCtrl.js is connected");

app.controller("HomeCtrl", function($scope, AuthUserFactory) {
	let s = $scope;

	console.log("HomeCtrl.js is working");

	s.logout = () => AuthUserFactory.logoutUser();

});