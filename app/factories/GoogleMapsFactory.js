"use strict";

console.log("GoogleMapsFactory.js is connected");

app.factory("GoogleMapsFactory", function($http, $sce, GoogleMapsConfig) {

	let GoogleMapsRequest = () => {
		$http.get($sce.trustAsResourceUrl(GoogleMapsConfig.googleMapsUrl)).then(
				(response) => console.log(response.data)
			);
	};

	// let GoogleLibraryPlaces = () => {

	// }


	return {
		GoogleMapsRequest
	};

});
