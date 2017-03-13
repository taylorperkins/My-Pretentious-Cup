"use strict";

console.log("SampleCtrl.js is connected");

app.controller("SampleCtrl", function($scope) {
	let s = $scope;

	s.a = "This is a";
	s.b = "This is b";

	console.log("SampleCtrl.js is working");

		
});