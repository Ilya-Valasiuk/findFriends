console.log('here');
var app = angular.module('app.routing', ['ngRoute']);
app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
            templateUrl: '/components/main/main.html',
            controller: 'mainController'
        })
        .when('/login', {
            templateUrl: '/components/login/login.html',
            controller: 'loginController'
        })
        .when('/signup', {
            templateUrl: '/components/signup/signup.html',
            controller: 'signupController'
        })
		.otherwise({
        	redirectTo: "/"
    	});
		

		 // use the HTML5 History API
        $locationProvider.html5Mode(true);
});