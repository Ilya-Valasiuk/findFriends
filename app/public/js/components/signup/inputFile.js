(function () {
	'use strict'

	angular.module('app.signup')
		.directive('inputFile', function() {
			function readImagePromise(file) {
				return new Promise(function (resolve, reject) {
					var reader = new FileReader();
				    var image  = new Image();
				    reader.readAsDataURL(file);  
				    reader.onload = function(_file) {
				        image.src = _file.target.result;              // url.createObjectURL(file);
				        image.onload = function() {
				                image.width = 400;
				                image.height = 200;
				            document.body.querySelector('.previewImage').appendChild(image);
				            resolve(this.src);
				        };
				        image.onerror= function() {
				            alert('Invalid file type: '+ file.type);
				        };      
				    };
				});
			}

			return {
				restrict: 'A',
				require: 'ngModel',
				replace: true,
				template: '<input type="file" id="profileimage" name="profileimage" data-ng-model="profileimage">',
				link: function ($scope, element, attrs, model) {
					model.$setValidity('empty', false);
					element[0].addEventListener('change', function (e) {
						readImagePromise(this.files[0])
							.then(function(base64url) {
								$scope.$apply(function () {
									model.$setValidity('empty', true);
									$scope.setImageInfo(base64url);	
								});
							});
					}, false);
				}
			}
		});
})();