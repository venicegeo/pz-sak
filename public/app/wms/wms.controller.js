(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('WmsController', ['$scope', '$log', '$q',  WmsController]);

        function WmsController ($scope, $log, $q) {

	        $scope.center = {
					lat: 38.87820,
					lon: -77.012100,
					zoom: 11
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