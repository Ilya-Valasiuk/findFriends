(function () {
    'use strict'
    angular.module('app.map', [])
        .directive('map', function (uiGmapGoogleMapApi, userService) {
            return {
                restrict: 'A',
                replaces: true,
                templateUrl: 'components/map/map.tpl.html',
                link: function ($scope, element, attrs, model) {
                	function renderLayout(response) {
                		if(!response.data.success) {
                			$scope.chooseHobby = true;
                			userService.getUserInfo().then(function(res) {
                				renderMarkers([res.data.userInfo]);
                			});
                		} else {
                			$scope.chooseHobby = false;
                			renderMarkers(response.data.users);
                		}
                	}
                	function renderMarkers(users) {
                		var markers = [];
                		for(var i = 0; i < users.length; i++) {
                			var marker = {
	                            id: users[i]._id,
	                             icon: {
	                                url: users[i].image,
	                                scaledSize: new google.maps.Size(34, 44)
	                            },
	                            coords: {
	                                latitude: users[i].latitude,
	                                longitude: users[i].longitude
	                            },
	                            click: function (geo, scope, model) {
	                            	if(model.idKey !== userService.userInfo._id) {
	                            		userService.sendNotification(model.idKey);
	                            	}
	                            }
		                    };
		                    markers.push(marker);
                		}
            			$scope.map.markers = markers;
                	}
                    var setPosition = function (geo) {
                        $scope.map.center = {
                            latitude: geo.coords.latitude,
                            longitude: geo.coords.longitude
                        };
                        userService
                        	.savePosition(geo.coords.latitude, geo.coords.longitude)
                        	.then(userService.searchUsers)
                        	.then(renderLayout);
                    };
                    

                    $scope.map = {
                        center: {
                            latitude: 0, longitude: 0
                        },
                        zoom: 13,
                        markers: []
                    };
                   
                    uiGmapGoogleMapApi.then(function (maps) {
						navigator.geolocation.getCurrentPosition(setPosition);
                    });

                    $scope.$on('updateMap', function () {
                    	userService
                    		.searchUsers()
                    		.then(renderLayout);
                    })
                }
            }
        });
})();