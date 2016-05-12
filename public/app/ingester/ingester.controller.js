/*
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
(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('IngesterController', ['$scope', '$http', 'toaster', 'discover', 'gateway', IngesterController]);


    function IngesterController($scope, $http, toaster, discover, gateway) {
        $scope.data = "none";
        $scope.metadata = "{}";

        $scope.ingest = function () {
            $scope.file = document.getElementById('file').files[0];

            var metadata = {};
            try{
                if (angular.isDefined($scope.metadata) && $scope.metadata !== "") {
                   metadata = JSON.parse($scope.metadata);
                }
            } catch (err) {
                toaster.pop("warning", "Parsing Error", "Improper JSON included in metadata: " + err.message);
                return;
            }
            var data = {};
            var endpoint = "";
            if (angular.isDefined($scope.ingestType) && $scope.ingestType == "Text") {
                if (angular.isUndefined($scope.message) || $scope.message == "") {
                    toaster.pop('warning', "Missing Required Field", "Must include Text to load.");
                    return;
                }
                data = {
                    "dataType": {
                        "type": $scope.ingestType.toLowerCase(),
                        "mimeType": $scope.mimeType,
                        "content": $scope.message
                    },
                    "metadata": metadata
                };
                endpoint = "/data";
            } else if (angular.isDefined($scope.ingestType) && $scope.ingestType == "File") {
                if (angular.isUndefined($scope.file) || $scope.file == "") {
                    toaster.pop('warning', "Missing Required Field", "Must include one file to upload.");
                    return;
                }
                data = {
                    "dataType": {
                        "type": "raster"
                    },
                    "metadata": metadata
                };
                endpoint = "/data/file";
            }
            var ingestObj = {
                "type": "ingest",
                "host": "true",
                "data": data
            };

            var httpObject = {
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + endpoint
            };

            if ($scope.ingestType == 'File') {
                var fd = new FormData();
                fd.append( 'data', JSON.stringify(ingestObj) );
                fd.append( 'file', document.getElementById('file').files[0]);

                angular.extend(httpObject, {
                    data: fd,
                    headers: {
                        "Content-Type": undefined
                    }
                });
            } else {
                angular.extend(httpObject, {
                    data: ingestObj
                });
            }

            $http(httpObject).then(function successCallback( html ) {
                $scope.jobIdResult = html.data.jobId;
                toaster.pop('success', "Success", "The data was successfully sent to the loader.")
            }, function errorCallback(response){
                if (response.data.message) {
                    $scope.errorMsg = response.data.message;
                }
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        };

        $scope.getJobStatus = function() {
            if (angular.isUndefined($scope.jobId) || $scope.jobId == "") {
                toaster.pop('warning', "Missing Required Field", "Must include Job ID.");
                return;
            }

            gateway.async(
                "GET",
                "/job/" + $scope.jobId
            ).then(function successCallback( html ) {
                $scope.jobStatus = html.data;
            }, function errorCallback(response){
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }
    }
})();
