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

		angular.module('uiGmapgoogle-maps', [])
		.config(function (uiGmapGoogleMapApiProvider) {
			uiGmapGoogleMapApiProvider.configure({
	           key: 'AIzaSyDFrymUqlJ2J5OkB1PfMkFk6N9K7TGxbGQ',
		        v: '3.20', //defaults to latest 3.X anyhow
		        libraries: 'weather,geometry,visualization'
		    });
		});
})();