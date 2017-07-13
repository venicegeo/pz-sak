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

(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('IngesterController', ['$scope', '$http', 'toaster', 'discover', 'gateway', 'Auth', IngesterController]);


    function IngesterController($scope, $http, toaster, discover, gateway, Auth) {
        $scope.data = "none";
        $scope.metadata = "{}";

        $scope.ingest = function () {
            $scope.file = document.getElementById('file').files[0];

            var metadata = {};
            try{
                metadata = parseMetadata($scope.metadata, toaster);
            } catch (err) {
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
                url: "/proxy?url=" + discover.gatewayHost + endpoint,
                headers: {
                    "Authorization": "Basic " + Auth.id
                }
            };

            if ($scope.ingestType == 'File') {
                var fd = new FormData();
                fd.append( 'data', JSON.stringify(ingestObj) );
                fd.append( 'file', $scope.file);

                angular.extend(httpObject, {
                    data: fd,
                    headers: {
                        "Content-Type": undefined,
                        "Authorization": "Basic " + Auth.id
                    }
                });
            } else {
                angular.extend(httpObject, {
                    data: ingestObj
                });
            }

            $http(httpObject).then(function successCallback( html ) {
                $scope.jobIdResult = html.data.data.jobId;
                toaster.pop('success', "Success", "The data was successfully sent to the loader.")
            }, function errorCallback(response){
                if (response.data.message) {
                    $scope.errorMsg = response.data.message;
                }
                console.log("ingester.controller load fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with your load request.");
            });
        };

        $scope.getJobStatus = function() {
            $scope.jobStatus = getJobStatus($scope.jobId, gateway, toaster)
        }
    }

    function parseMetadata(metadata, toaster) {
        var data = {};
        try{
            if (angular.isDefined(metadata) && metadata !== "") {
                data = JSON.parse(metadata);
            }
        } catch (err) {
            toaster.pop("warning", "Parsing Error", "Improper JSON included in metadata: " + err.message);
            throw err;
        }
        return data;
    }

    function getJobStatus(jobId, gateway, toaster) {
        if (angular.isUndefined(jobId) || jobId == "") {
            toaster.pop('warning', "Missing Required Field", "Must include Job ID.");
            return;
        }

        gateway.async(
            "GET",
            "/job/" + jobId
        ).then(function ( html ) {
            return html.data.data;
        }, function (response){
            console.log("ingester.controller job status fail: " + response.status);
            toaster.pop('error', "Error", "There was an issue with your request.");
            return;
        });
    }

}
)();
