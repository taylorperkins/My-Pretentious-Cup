"use strict";
console.log("App.js is connected!");


angular.module("d3", [])
	.factory('d3Service', [function() {
		var d3;

		return d3;
	}]
);