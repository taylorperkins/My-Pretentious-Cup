"use strict";

app.controller("MainCtrl", function($scope, $uibModal, fbRef) {	
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

  //This is set up for when you want to change your user's profile picture. A modal appears
  //for you to crop a picture and update whatcha look like
	s.changeProfilePicture = () => {		
		
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../../partials/ProfilePicModal.html',      
      controller: 'ProfilePicCtrl',
      controllerAs: 's',
      size: 'lg',
      appendTo: $(".main-modal-profile-pic"),  
      //resolve with your current user's info 
      resolve: {
      	user: function() {      		
      		return s.currentUser;
      	}
      }
    }); 

    modalInstance.result.then(
        (selectedItem) => s.selected = selectedItem,
        () => console.log("Dismissed")
      );
	};	

});






