"use strict";

console.log("HomeCtrl.js is connected");

app.controller("HomeCtrl", function($scope, $sce, $timeout, AuthUserFactory, GoogleMapsConfig, fbRef) {
	let s = $scope;
	console.log("HomeCtrl.js is working");

	s.logout = () => AuthUserFactory.logoutUser();
	console.log(window.innerHeight);
	var windowHeight = window.innerHeight - 200;
	$timeout(function() {
		$(".main-row").height(windowHeight);
		$(".fieldJournal-row").height(windowHeight);
		$(".drinkingBuddies-row").height(windowHeight);
		$(".globe-row").height(windowHeight);

	}, 100);

});