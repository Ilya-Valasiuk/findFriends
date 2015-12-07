(function () {
	'use strict'

	angular.module('app.login', [])
		.controller('loginController', function ($scope, $location, userService, sessionService) {
			console.log('login ctrl init');
			$scope.user = {};
			$scope.submitForm = _submitForm;

			function _submitForm() {
				if($scope.loginForm.$valid) {
					userService.authenticate($scope.user)
					.then(function (res) {
						if(res.data.success) {
							$scope.$apply(function() {
								userService.setDataInStorage(res.data);
								$location.path('/');	
							});
						}
					});
				}
			}
		});
})();