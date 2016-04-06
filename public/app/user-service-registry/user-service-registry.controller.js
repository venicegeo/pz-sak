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
        .controller('UserServiceController', ['$scope', '$http', '$log', '$q', 'toaster', 'discover', '$timeout', 'usSpinnerService', UserServiceController]);



    function UserServiceController($scope, $http, $log, $q, toaster, discover, $timeout, usSpinnerService) {
        $scope.executeInputMap = {};
        $scope.executeOutputMap = {};
        $scope.method = 'GET';
        $scope.responseType = 'application/json';
        $scope.inputs = [];
        $scope.registerInputs = [];
        $scope.outputs = [];
        $scope.registerOutputs = [];
        $scope.serviceId = "";
        $scope.registerServiceId = "";
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
        $scope.maxSearchResultRetries = 10;
        $scope.maxListResultRetries = 10;
        $scope.maxDeleteResultRetries = 10;
        $scope.maxShowUpdateResultRetries = 10;
        $scope.maxUpdateResultRetries = 10;

        $scope.ExecuteResultsRetries = 0;
        $scope.RegisterResultsRetries = 0;
        $scope.DescribeServiceRetries = 0;
        $scope.SearchResultRetries = 0;
        $scope.ListResultRetries = 0;
        $scope.DeleteResultRetries = 0;
        $scope.ShowUpdateResultRetries = 0;
        $scope.UpdateResultRetries = 0;

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
                inputs[i].formatSelect = inputs[i].formats[0].mimeType;
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
                outputs[i].dataType.mimeType = outputs[i].formats[0].mimeType;
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
                url: '/proxy?url=' + discover.gatewayHost + '/job',
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback(html) {
                if (html.data.status.indexOf("Success") > -1) {
                    $scope.registerServiceId = (JSON.parse(html.data.result.text).resourceId);
                    $scope.jobStatusResult = html.data;
                    console.log($scope.registerServiceId);
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
                url: '/proxy?url=' + discover.gatewayHost + '/job',
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback(html) {
                $scope.resourceResult = JSON.stringify(html.data);
                toaster.pop("success","Success",  "The service was executed successfully.")
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
                url: '/proxy?url=' + discover.gatewayHost + '/job',
                data: fd,
                headers: {
                    "Content-Type": undefined
                }
            }).then(function successCallback(html) {
                if (html.data.status.indexOf("Success") > -1) {
                    $scope.dataId = html.data.result.dataId;
                    getResourceResult($scope.dataId)
                    $scope.jobStatusResult = JSON.stringify(html.data);
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
                if ((response.data.message == "Job Not Found.") &&
                    ($scope.ExecuteResultsRetries < $scope.maxExecuteResultsRetries)) {
                    console.log("job not registered yet... trying again");
                    window.setTimeout(getExecuteResult, 5000, jobId);
                } else {
                    console.log("search.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                }
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
                url: '/proxy?url=' + discover.gatewayHost + '/job',
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

            $scope.registerInputs.push(newInput);
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

            $scope.registerOutputs.push(newOutput);
        };

        $scope.addFormat = function($index) {
            var newFormat = {
                "mimeType" : "application/json",
                "encoding" : null,
                "schema" : null,
                "maximumMegabytes" : null,
                "dataType" : null
            }
            $scope.registerInputs[$index].formats.push(newFormat);
        };
        $scope.addOutputFormat = function($index) {
            var newFormat = {
                "mimeType" : "application/json",
                "encoding" : null,
                "schema" : null,
                "maximumMegabytes" : null,
                "dataType" : null
            }
            $scope.registerOutputs[$index].formats.push(newFormat);
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
                url: '/proxy?url=' + discover.gatewayHost + '/job',
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
                "inputs" : $scope.registerInputs,
                "outputs" : $scope.registerOutputs
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
                url: '/proxy?url=' + discover.gatewayHost + '/job',
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
                            "mimeType": inputs[i].formatSelect
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
           };
            var job = {
                "apiKey": "my-api-key-38n987",
                "jobType" : {
                    "type": "execute-service",
                    "data" : executeServiceData
                }
            };

            var fd = new FormData();
            var jobString = JSON.stringify(job);
            fd.append( 'body', jobString);
            var request = $http({
                method: "POST",
                url: '/proxy?url=' + discover.gatewayHost + '/job',
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

        $scope.getServicesResult = function( jobId ) {
            $scope.ListResultRetries += 1;

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "get",
                    "jobId": jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $scope.services = "";

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost +  "/job",
                data: fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {

                if (html.data.status.indexOf("Success") > -1) {
                    usSpinnerService.stop("spinner-list");
                    $scope.services = angular.fromJson(html.data.result.text);
                }
                else {
                    if ($scope.ListResultRetries < $scope.maxListResultRetries) {
                        window.setTimeout($scope.getServicesResult(jobId), 2000);
                    }
                    else {
                        usSpinnerService.stop("spinner-list");
                        console.log("List Results max tries exceeded");
                        toaster.pop('error', "Error", "List Results max tries exceeded");
                    }
                }

            }, function errorCallback(response){
                // If it's a 500 error because the job doesn't exist yet, just try again
                if (response.data.message == "Job Not Found.") {
                    console.log("job not registered yet... trying again");
                    window.setTimeout($scope.getServicesResult(jobId), 2000);
                } else {
                    usSpinnerService.stop("spinner-list");
                    console.log("service.controller fail" + response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the services.");
                }
            });

        };

        $scope.getServices = function() {

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "list-service"
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $scope.services = "";

                $http({
                    method: "POST",
                    url: "/proxy?url=" + discover.gatewayHost +  "/job",
                    data: fd,
                    headers: {"Content-Type": undefined}
                }).then(function successCallback( html ) {
                    usSpinnerService.spin("spinner-list");
                    $scope.ListResultRetries = 0;
                    $scope.getServicesResult(html.data.jobId);
                }, function errorCallback(response){
                    console.log("service.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the services.");
                });

        };

        $scope.searchServicesResult = function( jobId ) {

            $scope.SearchResultRetries += 1;

            var data = {
                "apiKey": "my-api-key-kidkeid",
                "jobType": {
                    "type": "get",
                    "jobId": jobId
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


                if (html.data.status.indexOf("Success") > -1) {
                    $scope.results = angular.fromJson(html.data.result.text);
                }
                else {
                    if ($scope.SearchResultRetries < $scope.maxSearchResultRetries) {
                        window.setTimeout($scope.searchServicesResult(jobId), 2000);
                    }
                    else {
                        console.log("Get Register Results max tries exceeded");
                        toaster.pop('error', "Error", "Get Register Results max tries exceeded");
                    }
                }

            }, function errorCallback(response){
                // If it's a 500 error because the job doesn't exist yet, just try again
                if (response.data.message == "Job Not Found.") {
                    console.log("job not registered yet... trying again");
                    window.setTimeout($scope.searchServicesResult(jobId), 2000);
                } else {
                    console.log("user-service-registry.controller fail on search");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                }
            });

        };

        $scope.searchServices = function() {

            var data = {
                "apiKey": "my-api-key-kidkeid",
                "jobType": {
                    "type": "search-service",
                    "data": {
                        field: $scope.searchField,
                        pattern: $scope.searchPattern
                    }
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
                $scope.SearchResultRetries = 0;
                $scope.searchServicesResult(html.data.jobId);
            }, function errorCallback(response){
                console.log("user-service-registry.controller fail on search");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };


        $scope.cancelUpdateService = function() {
            $scope.showUpdateService = !$scope.showUpdateService;
        };


        $scope.showUpdateResult = function( jobId ) {
            $scope.ShowUpdateResultRetries += 1;

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "get",
                    "jobId": jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback(html) {
                console.log(html);

                if (html.data.status.indexOf("Success") > -1) {
                    usSpinnerService.stop('spinner-update');
                    var results = angular.fromJson(html.data.result.text);
                    $scope.updateResourceId = results.id;
                    $scope.updateServiceName = results.resourceMetadata.name;
                    $scope.updateServiceDescrip = results.resourceMetadata.description;
                    $scope.updateServiceUrl = results.resourceMetadata.url;
                }
                else {
                    if ($scope.ShowUpdateResultRetries < $scope.maxShowUpdateResultRetries) {
                        window.setTimeout($scope.showUpdateResult(jobId), 1000);
                    }
                    else {
                        console.log("Describe Service Results max tries exceeded");
                        toaster.pop('error', "Error", "Describe Service Results max tries exceeded");
                        usSpinnerService.stop('spinner-update');
                    }
                }
            }, function errorCallback(res) {
                // If it's a 500 error because the job doesn't exist yet, just try again
                if (res.data.message == "Job Not Found.") {
                    console.log("job not registered yet... trying again");
                    window.setTimeout($scope.showUpdateResult(jobId), 1000);
                } else {
                    console.log("User Service.controller fail"+res.status);
                    toaster.pop('error', "Error", "There was a problem describing the service.");
                    usSpinnerService.stop('spinner-update');
                }
            });


        };

        $scope.showUpdateServiceForm = function(serviceId){
            usSpinnerService.spin('spinner-update');
            var jobId = "";
            if (!$scope.showUpdateService){
                $scope.showUpdateService = true;
            }
            else{
                $scope.showUpdateService = false;
            }

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType" : {
                    "type": "read-service",
                    "serviceID" : serviceId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $http({
                method: "POST",
                url: '/proxy?url=' + discover.gatewayHost + '/job',
                data :fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback( html ) {
                $scope.ShowUpdateResultRetries = 0;
                $scope.showUpdateResult(html.data.jobId)
            }, function errorCallback(response){
                usSpinnerService.stop("spinner-update");
                console.log("service.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the services.");
            });

        };

        $scope.updateServiceResult = function( jobId ) {
            $scope.UpdateResultRetries += 1;

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "get",
                    "jobId": jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback(html) {
                console.log(html);

                if (html.data.status.indexOf("Success") > -1) {
                    usSpinnerService.stop("spinner-update");
                    console.log(res);
                    $scope.getServices();

                    toaster.pop('success', "Success", "The service was successfully updated.")
                }
                else {
                    if ($scope.UpdateResultRetries < $scope.maxUpdateResultRetries) {
                        $timeout($scope.updateServiceResult(jobId), 5000);
                    }
                    else {
                        usSpinnerService.stop("spinner-update");
                        console.log("Update Service Results max tries exceeded");
                        toaster.pop('error', "Error", "Update Service Results max tries exceeded");
                    }
                }
            }, function errorCallback(res) {
                // If it's a 500 error because the job doesn't exist yet, just try again
                if (res.data.message == "Job Not Found.") {
                    console.log("job not registered yet... trying again");
                    $timeout($scope.updateServiceResult(jobId), 5000);
                } else {
                    usSpinnerService.stop("spinner-update");
                    console.log("User Service.controller fail"+res.status);
                    toaster.pop('error', "Error", "There was a problem updating the service.");
                }
            });

        };

        $scope.updateService = function(){
            var jobId = "";
            var serviceId = $scope.updateResourceId;


            /*if (!$scope.showUpdateService){
                $scope.showUpdateService = true;
            }
            else{
                $scope.showUpdateService = false;
            }*/

            var dataObj = {
                apiKey: "my-api-key-sakui",
                jobType: {
                    type: "update-service",
                    serviceID: serviceId,
                    data: {
                        id: serviceId,
                        resourceMetadata: {
                            name: $scope.updateServiceName,
                            description: $scope.updateServiceDescrip,
                            url: $scope.updateServiceUrl
                        }
                    }
                }
            };

            var fd = new FormData();
            fd.append('body', JSON.stringify(dataObj));

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback(res) {

                usSpinnerService.spin("spinner-update");
                $scope.UpdateResultRetries = 0;
                $scope.updateServiceResult(res.data.jobId);




            }, function errorCallback(res) {
                console.log("User Service.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem updating the Service.");
            });

            $scope.updateResourceId = "";
            $scope.updateServiceName = "";
            $scope.updateServiceDescrip = "";
            $scope.updateServiceUrl = "";
        };

        $scope.deleteServiceResult = function( jobId ) {
            $scope.DeleteResultRetries += 1;

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "get",
                    "jobId": jobId
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback(res) {
                console.log(res);

                if (res.data.status.indexOf("Success") > -1) {
                    $scope.getServices();
                    toaster.pop('success', "Success", "The service was successfully deleted.")

                }
                else {
                    if ($scope.DeleteResultRetries < $scope.maxDeleteResultRetries) {
                        window.setTimeout($scope.deleteServiceResult(jobId), 2000);
                    }
                    else {
                        console.log("Delete Service Results max tries exceeded");
                        toaster.pop('error', "Error", "Delete Service Results max tries exceeded");
                    }
                }

            }, function errorCallback(res) {
                // If it's a 500 error because the job doesn't exist yet, just try again
                if (res.data.message == "Job Not Found.") {
                    console.log("job not registered yet... trying again");
                    window.setTimeout($scope.deleteServiceResult(jobId), 2000);
                } else {
                    console.log("User Service.controller fail"+res.status);
                    toaster.pop('error', "Error", "There was a problem deleting the Service.");
                }
            });

        };

        $scope.deleteService = function(serviceId){

            var data = {
                "apiKey": "my-api-key-sakui",
                "jobType": {
                    "type": "delete-service",
                    "serviceID": serviceId,
                    "reason" : "SAK user request"
                }
            };

            var fd = new FormData();
            fd.append( 'body', JSON.stringify(data) );

            $http({
                method: "POST",
                url: "/proxy?url=" + discover.gatewayHost + "/job",
                data: fd,
                headers: {"Content-Type": undefined}
            }).then(function successCallback(res) {
                console.log(res);

                $scope.DeleteResultRetries = 0;
                $scope.deleteServiceResult(res.data.jobId);
            }, function errorCallback(res) {
                console.log("User Service.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem deleting the Service.");
            });
        };

    }
})();
