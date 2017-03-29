"use strict";

console.log("UserSettingsCtrl.js is connected");

app.controller("UserSettingsCtrl", function($scope, $uibModal, $uibModalInstance, user, $sce) {
	let s = $scope;
	console.log("UserSettingsCtrl.js is working");

	s.user = user;
	s.userInfo = {
		firstName: "",
		lastName: "",
		email: "",
		userName: "",
		password: "",
		reEnterPassword: "",
		birthDate: "",
		favoriteDrink: "Fave Le Drank",
		uid: ""
	};	
	s.drinks = ['Coffee', 'Tea', 'Beer', 'Wine'];


	s.saveUserProfile = () => {
		console.log("I am clicked on: ");
		console.log("Here is your user: ", user);
		$uibModalInstance.dismiss('cancel');
	};

	s.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  s.toEdit = (partialName) => {
  	s.userSelectedInfo = `partials/UserSettings/${partialName}.html`;
  };




});