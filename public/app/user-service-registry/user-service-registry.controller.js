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
        $scope.serviceId = "";
        $scope.jobId = "";
        $scope.bodyInputs = [];
        $scope.urlInputs = [];
        $scope.rasterInputs = [];
        $scope.textInputs = [];

        $scope.rasterOutputs = [];
        $scope.textOutputs = [];


        function processServiceInputs(inputs) {
            var i;
            for (i=0;i<inputs.length;i++){
                switch(inputs[i].dataType.type) {
                    case "body":
                        $scope.bodyInputs.push(inputs[i]);
                        break;
                    case "urlparameter":
                        $scope.urlInputs.push(inputs[i]);
                        break;
                    case "raster":
                        $scope.rasterInputs.push(inputs[i]);
                        break;
                    case "text":
                        $scope.textInputs.push(inputs[i]);
                        break;
                }
            }
        }
        function getRegisterResult(jobId) {
            var data = {
                "apiKey": "my-api-key-kidkeid",
                "jobType": {
                    "type": "get",
                    "jobId": $scope.jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );
            $http({
                method: "POST",
                url: 'http://localhost:11080/job',
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback(html) {
                if (html.data.status.indexOf("Success") > -1) {
                    $scope.serviceId = (JSON.parse(html.data.result.text).resourceId);
                    $scope.jobStatusResult = html.data;
                    console.log($scope.serviceId);
                }
                else {
                    getRegisterResult(jobId);
                }
            }, function errorCallback(response) {
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }

        function getDescribeServiceResult(jobId) {
            var data = {
                "apiKey": "my-api-key-kidkeid",
                "jobType": {
                    "type": "get",
                    "jobId": $scope.jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );
            $http({
                method: "POST",
                url: 'http://localhost:11080/job',
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback(html) {
                if (html.data.status.indexOf("Success") > -1) {
                    var serviceMetadata = JSON.parse(html.data.result.text);
                    $scope.serviceId = serviceMetadata.id;
                    $scope.inputs = serviceMetadata.inputs;
                    $scope.outputs = serviceMetadata.outputs;
                    processServiceInputs($scope.inputs);
                    console.log($scope.serviceId);
                }
                else {
                    getDescribeServiceResult(jobId);
                }
            }, function errorCallback(response) {
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }


        $scope.addInput = function() {

            var newInput = {
                "name" : "aString",
                "minOccurs" : 1,
                "maxOccurs" : 1,
                "dataType" : {
                    "type" : "body",
                    "mimeType" : "application/json"
                },
                "metadata" : {
                    "about" : "",
                    "href" : "",
                    "role" : "",
                    "title" : ""
                },
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
                "metadata" :  {
                    "about" : "",
                    "href" : "",
                    "role" : "",
                    "title" : ""
                },
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
        $scope.addOutputFormat = function($index) {
            var newFormat = {
                "mimeType" : "application/json",
                "encoding" : null,
                "schema" : null,
                "maximumMegabytes" : null,
                "dataType" : null
            }
            $scope.outputs[$index].formats.push(newFormat);
        };

        $scope.describeService = function() {
            $scope.errorMsg = "";
            var job = {
                "apiKey": "my-api-key-38n987",
                "jobType" : {
                    "type": "read-service",
                    "serviceID" : $scope.serviceId
                }
            };
            var fd = new FormData();
            fd.append( 'body', angular.toJson(job) );
            var request = $http({
                method: "POST",
                url: 'http://localhost:11080/job',
                data :fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {
                $scope.jobId = html.data.jobId;
                getDescribeServiceResult($scope.jobId)


            }, function errorCallback(response){
                console.log("user-service-registry.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        }
        $scope.registerService = function() {
            $scope.errorMsg = "";


            var resourceMetadata = {
                "name":$scope.serviceName,
                "description":$scope.serviceDescription,
                "url":$scope.serviceUrl,
                "method":$scope.method
            };

            var data = {
                "resourceMetadata" : resourceMetadata,
                "inputs" : $scope.inputs,
                "outputs" : $scope.outputs
            };
            var job = {
                "apiKey": "my-api-key-38n987",
                "jobType" : {
                    "type": "register-service",
                    "data" : data
                }
            };

            var fd = new FormData();
            fd.append( 'body', angular.toJson(job) );




            var request = $http({
                method: "POST",
                url: 'http://localhost:11080/job',
                data :fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {
               $scope.jobId = html.data.jobId;
                getRegisterResult($scope.jobId)


            }, function errorCallback(response){
                console.log("user-service-registry.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
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
