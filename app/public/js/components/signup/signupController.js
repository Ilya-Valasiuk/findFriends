(function () {
	'use strict'

	angular.module('app.signup', [])
		.controller('signupController', function ($scope, $location, userService) {

			_initUser();

			$scope.click = function () {
				console.log($scope);
				debugger
			}

			$scope.reset = _initUser;
			$scope.submit = _submit;
			$scope.setImageInfo = _setImageInfo;


			function _initUser() {
				$scope.user = {};
			}

			function _setImageInfo(url) {
				if(url) {
					$scope.user.image = url;	
				}
			}

			function _submit() {
				if($scope.signUpForm.$valid) {
					var saveUser = userService.saveUser($scope.user);
					saveUser.then(function() {
						$location.path('/login');
					});
				}
			}

		});
})()
