"use strict";

/*
	This controller is still within production phases
*/


app.controller("UserSettingsCtrl", function($scope, $uibModal, $uibModalInstance, user) {
	let s = $scope;	

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


	s.saveUserProfile = () => $uibModalInstance.dismiss('cancel');	
	s.cancel = () => $uibModalInstance.dismiss('cancel');  
  s.toEdit = (partialName) => s.userSelectedInfo = `partials/UserSettings/${partialName}.html`;
  
});