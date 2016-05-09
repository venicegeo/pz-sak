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
        .controller('WfsController', ['$scope', '$log', '$q', 'usSpinnerService', 'toaster', WfsController]);

        function WfsController ($scope, $log, $q, usSpinnerService, toaster) {

                //OpenLayers.ProxyHost = "/proxy/index?url=";

                $scope.source = [];
                //$scope.endPoint = 'http://demo.boundlessgeo.com/geoserver/wfs';
                //$scope.endPoint = 'http://omar.ossim.org/omar/wfs';
                //$scope.endPoint = 'http://localhost:8080/geoserver/wfs';
                //$scope.endPoint = 'http://demo.opengeo.org/geoserver/wfs';
                //$scope.endPoint = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
                //$scope.endPoint = 'http://clc.developpement-durable.gouv.fr/geoserver/wfs';
                //$scope.endPoint = 'http://localhost:8080/omar/wfs'
                //$scope.endPoint = 'http://localhost:7272/wfs';
                //$scope.endPoint = 'http://10.0.10.183:9999/wfs';
                //$scope.endPoint = 'http://10.0.10.183/geoserver/wfs';
                //$scope.endPoint = 'http://geoserver.piazzageo.io/geoserver/ows';

                // Only allow our geoserver instance for now (until we figure out proxy madness
                $scope.endPoint = 'http://geoserver.piazzageo.io/geoserver/ows';

                $scope.version = '1.1.0';
                $scope.outputFormat = 'JSON';
                $scope.maxFeatures = '50';
                //$scope.filter = "file_type='nitf'"

                $scope.showFeatureTypeSelect = false;
                $scope.showFeatureTypeTable = false;
                $scope.showGetFeatureTable = false;
                $scope.featureTypeItem = {};
                $scope.featureTypes = [];

                //$scope.getCapabilitiesUrl = '?service=WFS&version=1.1.0&request=GetCapabilities';
                //$scope.describeFeatureUrl = '?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=';
                //$scope.getFeatureUrl = '?service=WFS&version=1.1.0&request=GetFeature&outputFormat=JSON&maxFeatures=50&typeName=';

                var wfsClient;

                //TODO: Move to a factory
                //Refactored: 10.05.2015 - GetCapabilities
                $scope.getCapabilities = function () {
                    $log.warn('outputFormat', $scope.outputFormat);
                    var endPoint = $scope.endPoint;
                    if ($scope.endPoint.startsWith("http://")) {
                        endPoint = $scope.endPoint.substring(7);
                    }
                    $scope.proxiedEndPoint = "/uproxy/" + endPoint;
                    // $scope.proxiedEndPoint = "/geoserver/geoserver/ows";
                    wfsClient = new OGC.WFS.Client($scope.proxiedEndPoint);

                    $scope.showFeatureTypeSelect = false;
                    $scope.showFeatureTypeTable = false;

                    //Refactored: 10-06.2015 - Use the Client request from wfsClient library
                    $scope.capabilities = wfsClient.getFeatureTypes();
                    $log.debug('$scope.capabilities', $scope.capabilities);
                    $log.debug('$scope.capabilities.length', $scope.capabilities.length);
                    if ($scope.capabilities.length >= 1){

                        $scope.showFeatureTypeSelect = true;

                    }
                    else{
                        $scope.showFeatureTypeSelect = false;
                        $scope.showFeatureTypeTable = false;
                        toaster.pop('error', "Error", 'Error. Could not retrieve data from end point.  Please check the URL and try again.');
                    }

                };

                //TODO: Move to a factory
                // DescribeFeature
                $scope.describeFeature = function () {
                	if ($scope.selectedCapability != null) {
	                    $scope.columns = wfsClient.getFeatureTypeSchema($scope.selectedCapability.name, $scope.selectedCapability.featureNS).featureTypes[0].properties;
	                    $log.debug('$scope.columns (describeFeature)', $scope.columns);
	                    $log.debug('$scope.columns.length', $scope.columns.length);
	                    if($scope.columns.length >= 1){
	                        $scope.getFeature();
	                        $scope.showFeatureTypeTable = true;
	                    }
                	}
                };

                //TODO: Move to a factory
                // GetFeature
                $scope.getFeature = function () {

                    usSpinnerService.spin('spinner');

                    // $scope.getFeatureObj = wfsClient.getFeature('omar:raster_entry', 'http://omar.ossim.org', "file_type='nitf'", function(it) {
                    //	$log.warn('getFeature', it);
                    // } );

                    var deferred = $q.defer();


                    var wfsRequest = {
                        typeName: $scope.selectedCapability.name,
                        namespace: $scope.selectedCapability.featureNS,
                        version: $scope.version,
                        maxFeatures: $scope.maxFeatures,
                        outputFormat: $scope.outputFormat
                    };

                    if($scope.filter && $scope.filter.trim() !== ''){
                        wfsRequest.cql = $scope.filter;
                    }

                    wfsClient.getFeature(wfsRequest, function(data) {
                            deferred.resolve(data);
                    });

                    var promise = deferred.promise;
                    promise.then(function(data){

                        $scope.features = data;
                        $log.warn('$scope.features', $scope.features);
                        $scope.showGetFeatureTable = true;
                        usSpinnerService.stop('spinner');

                    });
                };

                $scope.manualWfs = function() {
                    var url = $scope.wfsFullUrl;
                    if (url.startsWith("http://")) {
                        url = url.substr(7);
                    }
                    $scope.showManualFeatureTypeTable = false;
                    $scope.showManualGetFeatureTable = false;

                    if (url.indexOf("DescribeFeatureType") > 0) {
                        $scope.manualHeader = "Describe Feature List";
                        var formatter = new OpenLayers.Format.WFSDescribeFeatureType();

                        OpenLayers.Request.GET( {
                            url: "/uproxy/" + url,
                            async: false,
                            success: function ( request )
                            {
                                var doc = request.responseXML;
                                if ( !doc || !doc.documentElement )
                                {
                                    doc = request.responseText;
                                }

                                // use the tool to parse the data
                                var response = (formatter.read( doc ));

                                //console.log( 'response', response );
                                $scope.describeResults = response.featureTypes[0].properties;
                                $scope.showManualFeatureTypeTable = true;
                            },
                            error: function ( error )
                            {
                                console.log( 'error', error );
                            }
                        } );
                    } else {
                        $scope.manualHeader = "Get Feature(s)";
                        var format = new OpenLayers.Format.JSON();

                        OpenLayers.Request.GET({
                            url: "/uproxy/" + url,
                            async: false,
                            success: function (request){
                                var response = request;

                                var doc = request.responseXML;

                                if (!doc || !doc.documentElement ){
                                    doc = request.responseText;
                                }

                                // use the formatter to parse the data
                                var response = (format.read(doc));

                                //console.log(response.features);

                                $scope.featureResults = response.features;
                                $scope.columnNames = Object.keys(response.features[0].properties);
                                $scope.showManualGetFeatureTable = true;
                            },
                            failure: function (error){
                                alert(error);
                            }
                        } );

                    }
                };
        }

})();