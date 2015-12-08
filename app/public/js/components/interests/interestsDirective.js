(function () {
	'use strict'
	angular.module('app.interests', [])
		.directive('interests', function (interestsService) {
			return {
				restrict: 'A',
				replaces: true,
				templateUrl: 'components/interests/interests.tpl.html',
				link: function ($scope, element, attrs, model) {
					var userSelected = [];
					$scope.interests = [];

					$scope.addInteres = function (id) {
						interestsService.addInteres(id).then(function (response) {
							userSelected = response.data.interests;
							$scope.$emit('updateMap');
						});
					}
					$scope.removeInteres = function (id) {
						interestsService.removeInteres(id).then(function (response) {
							userSelected = response.data.interests;
							$scope.$emit('updateMap');
						});
					}

					$scope.isUserSelected = function(id) {
						return ~userSelected.indexOf(id);
					}

					 $scope.searchFilter = function (obj) {
				        var re = new RegExp($scope.searchText, 'i');
				        return !$scope.searchText || re.test(obj.title) || re.test(obj.description);
				    };

					interestsService.getInterest().then(function (response) {
						$scope.interests = response.data.interests;
					});
					interestsService.getUserInterest().then(function (response) {
						userSelected = response.data.interests;
					});
				}	
			}
		});
})();