(function () {
	'use strict'

	angular.module('app.main', [])
		.controller('mainController', function($scope, $location, userService) {
			if(!userService.isAuthenticate()) {
				$location.path('/login');
			}
		});

})()
