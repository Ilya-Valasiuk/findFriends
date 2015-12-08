(function () {
	'use strict'
	angular.module('app.footer', [])
		.directive('footer', function () {
			return {
				restrict: 'A',
				replaces: true,
				templateUrl: 'components/footer/footer.tpl.html',
				link: function ($scope, element, attrs, model) {
					console.log('footer link fn');
				}	
			}
		});
})();