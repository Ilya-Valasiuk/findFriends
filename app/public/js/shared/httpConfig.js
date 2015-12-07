(function() {
	'use strict'
	angular.module('app.main')
		.factory('sessionInjector', function (sessionService) {
			var sessionInjector = {
		        request: function(config) {
		            if (!sessionService.isAnonymus) {
		                config.headers['x-access-token'] = sessionService.token;
		            }
		            return config;
		        }
		    };
		    return sessionInjector;
		})
		.config(function ($httpProvider) {
			$httpProvider.interceptors.push('sessionInjector');
		});
})();