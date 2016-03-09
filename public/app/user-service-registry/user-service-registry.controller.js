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

        $scope.registerService = function() {
            $scope.errorMsg = "";

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
        $scope.listServices = function() {
            var jobId = "";
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-servicecontroller"
            }).then(function(result) {
                $http.post(
                    "/proxy?url=" + result.data.address + "/servicecontroller/executeService",
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
                    .then(function(resultJobList)
                {
                    $http.get(
                        "/porxy?url=" +result.data.address + "/servicecontroller/job",
                    jobId,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                    ).then(function successCallback( html ) {
                    $scope.jobsList = html.data.result.text;
                }, function errorCallback(response){
                    console.log("user-service-registry.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });


            });

        });
        };

    }
})();
