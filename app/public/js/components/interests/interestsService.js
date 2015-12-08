(function () {
	'use strict'
	angular.module('app.interests')
		.service('interestsService', function($http) {

			this.getInterest = function () {
				return $http.get('/api/interests');
			};

			this.getUserInterest = function () {
				return $http.get('/api/user/interests');
			};

			this.addInteres = function (id) {
				return $http.put('/api/user/interests/' + id);
			}
			this.removeInteres = function (id) {
				return $http.delete('/api/user/interests/' + id);
			}
		});
})();