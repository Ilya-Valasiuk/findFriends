(function () {
	'use strict'

	angular.module('app.main')
		.service('userService', function($http, sessionService) {
			var _isAuthenticate = !sessionService.isAnonymus;

			this.isAuthenticate = function () {
				return _isAuthenticate;
			}

			this.saveUser = function (data) {
				return $http.post('/api/createUser', JSON.stringify(data));
			};

			this.authenticate = function(data) {
				return new Promise(function (resolve, reject) {
					$http.post('/api/authenticate', JSON.stringify(data))
						.then(function (res) {
							_isAuthenticate = res.data.success;
							resolve(res);
						})
					});
				};
			this.setDataInStorage = function (data) {
				sessionService.setData(data);
			};
		});
})()