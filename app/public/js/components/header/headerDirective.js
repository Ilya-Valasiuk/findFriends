(function () {
	'use strict'
	angular.module('app.header', [])
		.directive('header', function (userService) {
			return {
				restrict: 'A',
				replaces: true,
				templateUrl: 'components/header/header.tpl.html',
				link: function ($scope, element, attrs, model) {
			
					$scope.logOut = _logOut;
					$scope.removeNotification = function (id) {
						userService.removeNotification(id)
							.then(function(res) {
								$scope.user = res.data.userInfo;
							});
					}
					
					userService.getUserInfo()
						.then(function(userInfo) {
							$scope.user = userInfo.data.userInfo;
						});

					function _logOut() {
						userService.logOut();
					}
				}	
			}
		});
})();