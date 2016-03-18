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
        .controller('UserServiceController', ['$scope', '$http', '$log', '$q', 'toaster', UserServiceController]);


    function UserServiceController($scope, $http, $log, $q, toaster) {
        $scope.method = 'GET';
        $scope.responseType = 'application/json';
        $scope.inputs = [];
        $scope.outputs = [];


        $scope.addInput = function() {

            var newInput = {
                "name" : "aString",
                "minOccurs" : 1,
                "maxOccurs" : 1,
                "dataType" : {
                    "type" : "body",
                    "mimeType" : "application/json"
                },
                "metadata" : null,
                "formats" : []
            }

            $scope.inputs.push(newInput);
        };

        $scope.addOutput = function() {

            var newOutput = {
                "name" : "aString",
                "minOccurs" : 1,
                "maxOccurs" : 1,
                "dataType" : {
                    "type" : "body",
                    "mimeType" : "application/json"
                },
                "metadata" : null,
                "formats" : []
            }

            $scope.outputs.push(newOutput);
        };

        $scope.addFormat = function($index) {
            var newFormat = {
                "mimeType" : "application/json",
                "encoding" : null,
                "schema" : null,
                "maximumMegabytes" : null,
                "dataType" : null
            }
            $scope.inputs[$index].formats.push(newFormat);
        };
        $scope.registerService = function() {
            $scope.errorMsg = "";
            $http({
                method: 'GET',
                url: 'http://localhost:11080/proxy/localhost:8086/servicecontroller/describeService?resourceId=97c21e9b-465d-44fc-a8d2-e5b81ea785ce'
            }).then(function(result){
                console.log(result);
            });
            $http({
                method: 'GET',
                url: 'http://localhost:11080/proxy/localhost:8086/servicecontroller/describeService?resourceId=97c21e9b-465d-44fc-a8d2-e5b81ea785ce'
            }).then(function(result){
                console.log(result);
            });

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-servicecontroller"
            }).then(function(result) {

                // Handle spaces or no spaces between
                var params = [""];
                if (!angular.isUndefined($scope.params) && $scope.params !== "") {
                    params = $scope.params.split(", ");
                    if (params.length == 1) {
                        params = params[0].split(",");
                    }
                }
                var data = {
                    "name":$scope.serviceName,
                    "description":$scope.serviceDescription,
                    "url":$scope.serviceUrl,
                    "method":$scope.method,
                    "params":params,
                    "responseMimeType":$scope.responseType
                };
                $http.post(
                    "/proxy?url=" + result.data.address + "/servicecontroller/registerService",
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(function successCallback( html ) {
                    $scope.resourceId = html.data.resourceId;
                }, function errorCallback(response){
                    console.log("user-service-registry.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

            });
        };

        $scope.executeService = function() {
            $scope.executeMsg = "";
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-servicecontroller"
            }).then(function(result) {

                if (angular.isUndefined($scope.dataInput)) {
                    $scope.dataInput = "";
                }
                var dataInputsObj = {};
                if (!angular.isUndefined($scope.dataInputs) && $scope.dataInputs !== "") {
                    dataInputsObj = JSON.parse($scope.dataInputs);
                }
                var data = {
                    "resourceId":$scope.resource,
                    "dataInput":$scope.dataInput,
                    "dataInputs":dataInputsObj
                };
                $http.post(
                    "/proxy?url=" + result.data.address + "/servicecontroller/executeService",
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(function successCallback( html ) {
                    $scope.serviceResponse = html.data;
                }, function errorCallback(response){
                    console.log("user-service-registry.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

            });

        };

    }
})();
