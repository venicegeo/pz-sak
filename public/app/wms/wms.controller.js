/**
 Copyright 2016, RadiantBlue Technologies, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('WmsController', ['$scope', '$log', 'olData', 'toaster',  WmsController]);

        function WmsController ($scope, $log, olData, toaster) {

			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				var target = $(e.target).attr("href");
				if (target == "#explorer") {
					$scope.layers.active = false;
					$scope.layers.active = true;
				} else {
					newmap.updateSize();
				}
			});

			var newmap = new ol.Map({
				target: 'newmap',
				layers: [
					new ol.layer.Tile({
						source: new ol.source.MapQuest({layer: 'sat'})
					})
				],
				view: new ol.View({
					//center: ol.proj.fromLonLat([-98, 39]),
					center: ol.proj.fromLonLat([0, 0]),
					zoom: 2
				})
			});


			$scope.endPoint = 'http://geoserver.piazzageo.io/geoserver/ows';
            $scope.version = '1.3.0';
            $scope.outputFormat = 'JSON';

            $scope.showLayerSelect = false;

			var getProxiedEndPoint = function() {
				var endPointUrl = $scope.endPoint;
				if ($scope.endPoint.startsWith("http://")) {
					endPointUrl = $scope.endPoint.substring(7);
				}
				return "/uproxy/" + endPointUrl;
			};

			angular.extend($scope, {
				/*view: {
					projection: "EPSG:4326",
					rotation: 0
				},*/
				center: {
        			lat: 0,
        			lon: 0,
        			zoom: 3,
					bounds: [],
					projection: "EPSG:4326"
        		},
        		defaults: {
        			layers: {
                        main: {
                        	name: "base",
                        	active: true,
                        	opacity: 0,
                            source: {
                                type: 'OSM',
                                url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                            }
                        }
                    },
        			interactions: {
        				mouseWheelZoom: true
        			},
        			controls: {
        				zoom: true,
        				rotate: true,
        				attribution: false
        			}
        		},
                layers: [
                  {
                	 active:true,
                	 opacity: 1,
                     source: {
                         type: 'ImageWMS',
                         url: getProxiedEndPoint(),
						 params: {}
                     }
					 //extent: []
                   }
                 ]
        	});

        	var wmsClient;

            $scope.getCapabilities = function () {
				$log.warn('outputFormat', $scope.outputFormat);
                wmsClient = new OGC.WMS.Client(getProxiedEndPoint(), $scope.version);

                $scope.showLayerSelect = false;

                $scope.capabilities = wmsClient.getLayers();
                $log.debug('$scope.capabilities', $scope.capabilities);
                $log.debug('$scope.capabilities.length', $scope.capabilities.length);
                if ($scope.capabilities.length >= 1){

                    $scope.showLayerSelect = true;

                }
                else{
                    $scope.showLayerSelect = false;
                    toaster.pop('error', "Error", "Could not retrieve data from end point.  Please check the URL and try again.");
                }

            };

			$scope.getCapabilitiesDoc = function() {
				window.open($scope.endPoint + "?service=WMS&version=" + $scope.version + "&request=GetCapabilities");
			};

			$scope.updateMap = function () {
            	if ($scope.selectedLayer != null) {
                    $scope.layers[0].source.params.LAYERS = $scope.selectedLayer.Name;
					$scope.layers[0].source.url = getProxiedEndPoint();
					var bounds;
					var extent;
					if ($scope.selectedLayer.EX_GeographicBoundingBox) {
						var minLon = $scope.selectedLayer.EX_GeographicBoundingBox[0];
						var minLat = $scope.selectedLayer.EX_GeographicBoundingBox[1];
						var maxLon = $scope.selectedLayer.EX_GeographicBoundingBox[2];
						var maxLat = $scope.selectedLayer.EX_GeographicBoundingBox[3];

						bounds = new OpenLayers.Bounds(
							minLon,
							minLat,
							maxLon,
							maxLat);

						extent = [
							minLon,
							minLat,
							maxLon,
							maxLat
						];
					} else {
						bounds = new OpenLayers.Bounds(
							$scope.selectedLayer.BoundingBox[0].extent[0],
							$scope.selectedLayer.BoundingBox[0].extent[1],
							$scope.selectedLayer.BoundingBox[0].extent[2],
							$scope.selectedLayer.BoundingBox[0].extent[3]);

						extent = $scope.selectedLayer.BoundingBox[0].extent;
					}
					var centerLonLat = bounds.getCenterLonLat();
					$scope.center.lon = centerLonLat.lon;
					$scope.center.lat = centerLonLat.lat;
					//$scope.layers[0].extent = extent;

					olData.getMap().then(function(olMap) {
						var mapSize = olMap.getSize();
						//var polygon = ol.geom.Polygon.fromExtent($scope.view.extent);
						olMap.getView().fit(extent, mapSize);

						olData.setMap(olMap, "map");
					});
            	}
            };


			$scope.parseUrlAndGetLayer = function() {
				var parser = document.createElement('a'),
					searchObject = {},
					queries, split, i;
				// Let the browser do the work
				parser.href = decodeURIComponent($scope.fullUrl);
				// Convert query string to object
				queries = parser.search.replace(/^\?/, '').split('&');
				for( i = 0; i < queries.length; i++ ) {
					split = queries[i].split('=');
					searchObject[split[0]] = split[1];
				}

				console.log(searchObject);
				console.log(parser.origin);
				console.log(parser.pathname);
				var bbox = searchObject.BBOX.split(",");
				var bboxAsFloat = [];
				bbox.forEach(function(value, index) {
					bboxAsFloat[index] = parseFloat(value);
				});

				newmap.removeLayer($scope.overlay);
				var source = new ol.source.ImageWMS({
					url: parser.origin + parser.pathname,
					params: {
						LAYERS: searchObject.LAYERS
					},
					serverType: 'geoserver'
				});
				$scope.overlay =new ol.layer.Image({
					extent: bboxAsFloat,
					source: source
				});
				newmap.addLayer($scope.overlay);

				newmap.getView().fit($scope.overlay.getExtent(), newmap.getSize());
			};
        }

})();
