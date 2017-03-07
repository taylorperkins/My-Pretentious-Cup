"use strict";
console.log("App.js is connected!");

/*
An Angular Application that allows users to create, save, edit, and delete notes
Each user wil have their own separate database within Firebase
There are 4 different screen displays
	1. Login
	2. Register
	3. List All Notes
	4. Create New Notes

Each page has a controller directly related to it.
*/

var app = angular.module("MyPretentiousCup", ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
	
});

app.run(($location, FBCreds) => {
	console.log("You are connected");
});













