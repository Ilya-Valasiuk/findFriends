(function() {
	'use strict'

	angular.module('app.main')
		.service('sessionService', function ($window) {
			this.isAnonymus = $window.sessionStorage.getItem('user-token') ? false : true;
			this.token = $window.sessionStorage.getItem('user-token') ? $window.sessionStorage.getItem('user-token') : '';

			this.setData = function (data) {
				$window.sessionStorage.setItem('user-token', data.token);
				this.isAnonymus = false;
				this.token = $window.sessionStorage.getItem('user-token');
			};
			this.removeToken = function () {
				$window.sessionStorage.removeItem('user-token');
			}
		});
})()