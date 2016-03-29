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
        .controller('IngesterController', ['$scope', '$http', '$log', '$q', 'toaster', 'discover', IngesterController]);


    function IngesterController($scope, $http, $log, $q, toaster, discover) {
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
            if (angular.isDefined($scope.ingestType) && $scope.ingestType == "Text") {
                if (angular.isUndefined($scope.message) || $scope.message == "") {
                    toaster.pop('warning', "Missing Required Field", "Must include Text to ingest.");
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
            }
            var ingestObj = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "ingest",
                    "host": "true",
                    "data": data
                }
            };

            var fd = new FormData();
            fd.append( 'body',  JSON.stringify(ingestObj) );
            if ($scope.ingestType == 'File') {
                fd.append('file', document.getElementById('file').files[0]);
            }

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback( html ) {
                $scope.jobIdResult = html.data.jobId;
                toaster.pop('success', "Success", "The data was successfully sent to the ingester.")
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
            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "get",
                    "jobId": $scope.jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback( html ) {
                $scope.jobStatus = html.data;
            }, function errorCallback(response){
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }
    }
})();
