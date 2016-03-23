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
        $scope.executeInputMap = {};
        $scope.executeOutputMap = {};
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
        $scope.selectedOutput = 0;
        $scope.resourceResult = "";


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

        function processServiceOutputs(outputs) {
            var i;
            for (i=0;i<outputs.length;i++) {
                switch(outputs[i].dataType.type) {
                    case "raster":
                        $scope.rasterOutputs.push(outputs[i]);
                        break;
                    case "text":
                        $scope.textOutputs.push(outputs[i]);
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
        function getResourceResult(resourceId){
            var data = {
                "apiKey": "my-api-key-kidkeid",
                "jobType": {
                    "type": "get-resource",
                    "resourceId": resourceId
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
                $scope.resourceResult = JSON.stringify(html.data);
            }, function errorCallback(response) {
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }
        function getExecuteResult(jobId) {
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
                    $scope.dataId = html.data.result.dataId;
                    getResourceResult($scope.dataId)
                    $scope.jobStatusResult = html.data;
                    console.log($scope.serviceId);
                }
                else {
                    getExecuteResult(jobId);
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

        function createExecuteInputMap(inputs) {
            //executeInputMap
            var i = 0;
            for (i = 0; i < inputs.length; i++) {
                switch (inputs[i].dataType.type) {
                    case "body":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": inputs[i].dataType.type,
                            "mimeType": inputs[i].dataType.mimeType
                        }
                        break;
                    case "urlparameter":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": "text"
                        }
                        break;
                    case "raster":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": inputs[i].dataType.type,
                            "mimeType": inputs[i].dataType.mimeType
                        }
                        break;
                    case "text":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": inputs[i].dataType.type,
                            "mimeType": inputs[i].dataType.mimeType
                        }
                        break;

                }
            }
        }
        $scope.executeService = function() {
            createExecuteInputMap($scope.inputs);
            $scope.executeMsg = "";
           var executeServiceData = {
               "serviceId" : $scope.serviceId,
               "dataInputs" : $scope.executeInputMap
               //TODO When use latest version of executeServiceData, "dataOutput" : $scope.outputs[$scope.selectedOutput].dataType
           };
            var job = {
                "apiKey": "my-api-key-38n987",
                "jobType" : {
                    "type": "execute-service",
                    "data" : executeServiceData
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
                getExecuteResult($scope.jobId)


            }, function errorCallback(response){
                console.log("user-service-registry.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

    }
})();
