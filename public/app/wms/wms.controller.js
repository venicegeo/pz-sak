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
        .controller('WmsController', ['$scope', '$log', '$q', 'olData', 'toaster',  WmsController]);

        function WmsController ($scope, $log, $q, olData, toaster) {
            // $scope.endPoint = 'http://demo.boundlessgeo.com/geoserver/wms';
            // $scope.endPoint = 'http://localhost:8081/geoserver/ows';
			var getEndPoint = function() {
				var endPoint = $scope.endPoint;
				if ($scope.endPoint.startsWith("http://")) {
					endPoint = $scope.endPoint.substring(7);
				}
				return endPoint;
			};
			$scope.endPoint = 'http://geoserver.piazzageo.io/geoserver/ows';
			$scope.proxiedEndPoint = "/proxy/" + getEndPoint();
			//$scope.endPoint = '';
            $scope.version = '1.3.0';
            $scope.outputFormat = 'JSON';

            $scope.showLayerSelect = false;

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
                         url: $scope.proxiedEndPoint,
						 params: {}
                     },
					 extent: []
                   }
                 ]
        	});

        	var wmsClient;
        	
            $scope.getCapabilities = function () {
				$log.warn('outputFormat', $scope.outputFormat);
                wmsClient = new OGC.WMS.Client($scope.proxiedEndPoint, $scope.version);

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
			}

            $scope.updateMap = function () {
            	if ($scope.selectedLayer != null) {
                    $scope.layers[0].source.params.LAYERS = $scope.selectedLayer.Name;
					var bounds;
					var extent;
					if ($scope.selectedLayer.EX_GeographicBoundingBox) {
						bounds = new OpenLayers.Bounds(
							$scope.selectedLayer.EX_GeographicBoundingBox[0],
							$scope.selectedLayer.EX_GeographicBoundingBox[1],
							$scope.selectedLayer.EX_GeographicBoundingBox[2],
							$scope.selectedLayer.EX_GeographicBoundingBox[3]);

						extent = [
							$scope.selectedLayer.EX_GeographicBoundingBox[0],
							$scope.selectedLayer.EX_GeographicBoundingBox[1],
							$scope.selectedLayer.EX_GeographicBoundingBox[2],
							$scope.selectedLayer.EX_GeographicBoundingBox[3]
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
					$scope.layers[0].extent = extent;

					olData.getMap().then(function(olMap) {
						var mapSize = olMap.getSize();
						//var polygon = ol.geom.Polygon.fromExtent($scope.view.extent);
						olMap.getView().fit(extent, mapSize);

						olData.setMap(olMap, "map");
					});
            	}
            };


	    		/*var layers = [
	    	              new ol.layer.Tile({
	    	                source: new ol.source.MapQuest({layer: 'sat'})
	    	              }),
	    	              new ol.layer.Image({
	    	                extent: [-13884991, 2870341, -7455066, 6338219],
	    	                source: new ol.source.ImageWMS({
	    	                  url: 'http://demo.boundlessgeo.com/geoserver/wms',
	    	                  params: {'LAYERS': 'topp:states'},
	    	                  serverType: 'geoserver'
	    	                })
	    	              })
	    	            ];
	    	    var map = new ol.Map({
	    	              layers: layers,
	    	              target: 'map',
	    	              view: new ol.View({
	    	                center: [-10997148, 4569099],
	    	                zoom: 4
	    	              })
	    	            });*/
        }

})();
