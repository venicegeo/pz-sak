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
        .controller('UserServiceController', ['$scope', '$http', '$log', '$q', 'toaster', 'discover', UserServiceController]);



    function UserServiceController($scope, $http, $log, $q, toaster, discover) {
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

        //Request Limits
        $scope.maxExecuteResultsRetries = 50;
        $scope.maxRegisterResultsRetries = 10;
        $scope.maxDescribeServiceRetries = 10;

        $scope.ExecuteResultsRetries = 0;
        $scope.RegisterResultsRetries = 0;
        $scope.DescribeServiceRetries = 0;

        function resetServiceInputArrays() {
            $scope.bodyInputs = [];
            $scope.urlInputs = [];
            $scope.rasterInputs = [];
            $scope.textInputs = [];


        }
        function resetServiceOutputArrays(){
            $scope.rasterOutputs = [];
            $scope.textOutputs = [];

        }

        function processServiceInputs(inputs) {
            resetServiceInputArrays();
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
            resetServiceOutputArrays();
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
            $scope.RegisterResultsRetries += 1;
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
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
                    if ($scope.RegisterResultsRetries < $scope.maxRegisterResultsRetries) {
                        window.setTimeout(getRegisterResult, 1000, jobId);
                    }
                    else {
                        console.log("Get Register Results max tries exceeded");
                        toaster.pop('error', "Error", "Get Register Results max tries exceeded");
                    }
                    //getRegisterResult(jobId);
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
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
            $scope.ExecuteResultsRetries += 1;
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
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
                    if ($scope.ExecuteResultsRetries < $scope.maxExecuteResultsRetries) {
                        window.setTimeout(getExecuteResult, 5000, jobId);
                    }
                    else {
                        console.log("Exceeded Get Execute Results retry limit");
                        toaster.pop('error', "Error", "Exceeded Get Execute Results retry limit")
                    }
                    //getgetExecuteResult(jobId);
                }
            }, function errorCallback(response) {
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }

        function getDescribeServiceResult(jobId) {
            $scope.DescribeServiceRetries += 1;
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
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
                    processServiceOutputs($scope.outputs);
                    console.log($scope.serviceId);
                }
                else {
                    if ($scope.DescribeServiceRetries < $scope.maxDescribeServiceRetries) {
                        window.setTimeout(getDescribeServiceResult, 1000, jobId);
                    }
                    else {
                        console.log("Get Describe Service Retries limit exceeded");
                        toaster.pop('error', "Error", "Get Describe Service Retries limit exceeded.");
                    }
                    //getDescribeServiceResult(jobId);
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
                data :fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {
                $scope.jobId = html.data.jobId;
                $scope.DescribeServiceRetries = 0;
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
                data :fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {
               $scope.jobId = html.data.jobId;
                $scope.RegisterResultsRetries = 0;
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
                    // TODO: Looks like this can be simplified because body, raster and text all do the same thing
                    case "urlparameter":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": "text"
                        }
                        break;
                    case "body":
                    case "raster":
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
               "dataInputs" : $scope.executeInputMap,
               "dataOutput" : $scope.outputs[$scope.selectedOutput].dataType
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
                url: '/proxy?url=pz-gateway.stage.geointservices.io/job',
                data :fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {
                $scope.jobId = html.data.jobId;
                $scope.ExecuteResultsRetries = 0;
                getExecuteResult($scope.jobId)


            }, function errorCallback(response){
                console.log("user-service-registry.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        $scope.getServices = function() {

            //TODO: Go through gateway

            $scope.services = "";

            //discover.async().then(function(result) {

                // Service controller through discover was still pointed at the old env so hard coded for now
                $http({
                    method: "GET",
                    //url: "/proxy?url=" + result.serviceControllerHost + "/servicecontroller/listService",
                    url: "/proxy?url=pz-servicecontroller.stage.geointservices.io/servicecontroller/listService"
                }).then(function successCallback( html ) {
                    $scope.services = html.data;
                }, function errorCallback(response){
                    console.log("service.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the services.");
                });

        };

        $scope.searchServices = function() {

            //TODO: go through gateway
            $scope.search = "";
            var dataObj = {
                field: $scope.searchField,
                pattern: $scope.searchPattern
            };

            //discover.async().then(function(result) {

                // Service controller through discover was still pointed at the old env so hard coded for now
                $http.post(
                    //"/proxy?url=" + result.serviceControllerHost + "/servicecontroller/search",
                    "/proxy?url=pz-servicecontroller.stage.geointservices.io/servicecontroller/search",
                    dataObj,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(function successCallback( html ) {
                    $scope.results = html.data;
                }, function errorCallback(response){
                    console.log("user-service-registry.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });
            //});
        };


        $scope.cancelUpdateService = function() {
            $scope.showUpdateService = !$scope.showUpdateService;
        };

        $scope.showUpdateServiceForm = function(serviceId){
            var jobId = "";
            if (!$scope.showUpdateService){
                $scope.showUpdateService = true;
            }
            else{
                $scope.showUpdateService = false;
            }
            discover.async().then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.serviceControllerHost + "/servicecontroller/describeService?resourceId="+serviceId,
                }).then(function successCallback( html ) {
                    $scope.updateResourceId = html.data.id;
                    $scope.updateServiceName = html.data.resourceMetadata.name;
                    $scope.updateServiceDescrip = html.data.resourceMetadata.description;
                    $scope.updateServiceUrl = html.data.resourceMetadata.url;
                }, function errorCallback(response){
                    console.log("service.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the services.");
                });
            });
        };

        $scope.updateService = function(){
            var jobId = "";
            var serviceId = $scope.updateResourceId;


            if (!$scope.showUpdateService){
                $scope.showUpdateService = true;
            }
            else{
                $scope.showUpdateService = false;
            }

            var dataObj = {
                id: serviceId,
                name: $scope.updateServiceName,
                resourceMetadata:{
                    name: $scope.updateServiceName,
                    description: $scope.updateServiceDescrip,
                    url: $scope.updateServiceUrl
                }
            };

            //TODO: go through the gateway
            discover.async().then(function(result) {

                $http.put(
                    "/proxy?url=" + result.serviceControllerHost + "/servicecontroller/updateService",
                    dataObj
                ).then(function successCallback(res) {
                    console.log(res);
                    $scope.getServices();

                    toaster.pop('success', "Success", "The service was successfully updated.")

                }, function errorCallback(res) {
                    console.log("User Service.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem updating the Service.");
                });
            })
            $scope.updateResourceId = "";
            $scope.updateServiceName = "";
            $scope.updateServiceDescrip = "";
            $scope.updateServiceUrl = "";
        };


        $scope.deleteService = function(serviceId){

            //TODO: go through the gateway
             discover.async().then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.serviceControllerHost + "/servicecontroller/deleteService?resourceId="+serviceId,
                }).then(function successCallback(res) {
                    console.log(res);
                    $scope.getServices();

                    toaster.pop('success', "Success", "The service was successfully deleted.")

                }, function errorCallback(res) {
                    console.log("User Service.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem deleting the Service.");
                });
            })
        };

    }
})();
