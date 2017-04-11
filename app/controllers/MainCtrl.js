"use strict";

console.log("MainCtrl.js is connected");

app.controller("MainCtrl", function($scope, $uibModal, fbRef, UserStorageFactory) {
	console.log("MainCtrl.js is working");
	let s = $scope;

	s.newsfeed = true;
	s.fieldJournalEntries = [];
	s.newsFeedDetails = '../../partials/NewsFeedDetails.html';
	s.reader = new FileReader();

  //this function listends for the fieldJournal collection in firebase to be set, then updates scope varialbes
  //to update the newsfeed
	fbRef.database().ref('fieldJournal/').on('value', function(snapshot) {	      
    let databaseSnapshot = snapshot.val();
    //with the values, iterate over them and create your entries
    s.fieldJournalEntries = Object.keys(databaseSnapshot).reverse().map((entry) => {
      databaseSnapshot[entry].uglyId = entry;
      return databaseSnapshot[entry];
    });   
	});			

	s.changeProfilePicture = () => {
		console.log("Here is where you should change your user's profile pic!");    
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/ProfilePicModal.html',      
      controller: 'ProfilePicCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".modal-profile-pic"),  
      resolve: {
      	user: function() {
      		let user = UserStorageFactory.getCurrentUserInfo(),
      				uglyId = Object.keys(user)[0];
      		user = user[uglyId];
      		user.ugly_id = uglyId;
      		return user;
      	}
      }
    }); 

    modalInstance.result.then(function (selectedItem) {
      s.selected = selectedItem;
    }, function () {
      console.log("Dismissed");
    });
	};	

});






