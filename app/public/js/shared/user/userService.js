(function () {
	'use strict'

	angular.module('app.main')
		.service('userService', function($location, $http, sessionService) {
			var self = this;
			var _isAuthenticate = !sessionService.isAnonymus;
			this.userInfo = {};
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
			this.logOut = function () {
				sessionService.removeToken();
				window.location.replace('/logout');
			};
			this.setDataInStorage = function (data) {
				sessionService.setData(data);
			};
			this.updateUser = _updateUser;

			this.getUserInfo = function () {
				return $http.get('/api/user');
			};

			this.savePosition = function (latitude, longitude) {
				return $http.put('/api/user/position/' + latitude + '&' + longitude);
			};

			this.searchUsers = function () {
				return $http.get('/api/search-users');
			};

			this.sendNotification = function (id) {
				return $http.put('/api/user/notification/' + id);
			};

			this.removeNotification = function (id) {
				return $http.delete('/api/user/notification/' + id);
			};

			_updateUser();

			function _updateUser() {
				if(self.isAuthenticate()) {
					$http.get('/api/user')
						.then(function (res) {
							self.userInfo = res.data.userInfo;	
						})
				}
			}
		});
})()