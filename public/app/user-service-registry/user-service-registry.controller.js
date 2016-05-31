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
        .controller('UserServiceController', ['$scope', 'toaster', '$timeout', 'usSpinnerService', 'gateway', UserServiceController]);



    function UserServiceController($scope, toaster, $timeout, usSpinnerService, gateway) {
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
        $scope.ExecuteResultsRetries = 0;

        $scope.showRegistrationSuccess = false;
        $scope.showExecuteSuccess = false;

        // Pagination for List
        $scope.services = [];
        $scope.totalServices = 0;
        $scope.listPerPage = 25;

        $scope.pagination = {
            current: 0
        };

        // Pagination for Search
        $scope.results = [];
        $scope.totalSearchResults = 0;
        $scope.searchPerPage = 25;

        $scope.searchPagination = {
            current: 0
        };

        $scope.pageOptions = [10, 25, 50, 100, 500];

        $scope.pageChanged = function(newPage) {
            $scope.getServices(newPage);
        };

        $scope.searchPageChanged = function(newPage) {
            $scope.searchServices(newPage)
        };

        var SLOW_POLL = 5000;

        /*function resetServiceInputArrays() {
            $scope.bodyInputs = [];
            $scope.urlInputs = [];
            $scope.rasterInputs = [];
            $scope.textInputs = [];


        }
        function resetServiceOutputArrays(){
            $scope.rasterOutputs = [];
            $scope.textOutputs = [];

        }*/

        /*function processServiceInputs(inputs) {
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
        }*/
        function getResourceResult(resourceId){

            gateway.async(
                "GET",
                '/data/' + resourceId
            ).then(function successCallback(html) {
                $scope.resourceResult = "";
                $scope.executeSuccess = JSON.stringify(html.data.data.dataId);
                $scope.showExecuteSuccess = true;
                toaster.pop("success","Success",  "The service was executed successfully.")
            }, function errorCallback(response) {
                console.log("service.controller Resource Result fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }
        function getExecuteResult(jobId) {
            $scope.ExecuteResultsRetries += 1;

            gateway.async(
                "GET",
                '/job/' + $scope.jobId
            ).then(function successCallback(html) {
                if (html.data.status.indexOf("Success") > -1) {
                    $scope.dataId = html.data.result.dataId;
                    getResourceResult($scope.dataId);
                    $scope.jobStatusResult = JSON.stringify(html.data);
                    console.log($scope.serviceId);
                }
                else {
                    if ($scope.ExecuteResultsRetries < $scope.maxExecuteResultsRetries) {
                        $timeout(getExecuteResult, SLOW_POLL, jobId);
                    }
                    else {
                        console.log("Exceeded Get Execute Results retry limit");
                        toaster.pop('error', "Error", "Exceeded Get Execute Results retry limit")
                    }
                }
            }, function errorCallback(response) {
                if ((response.data.message == "Job Not Found.") &&
                    ($scope.ExecuteResultsRetries < $scope.maxExecuteResultsRetries)) {
                    console.log("job not registered yet... trying again");
                    $timeout(getExecuteResult, SLOW_POLL, jobId);
                } else {
                    console.log("service.controller Execute Result fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                }
            });
        }

        $scope.describeService = function() {
            gateway.async(
                "GET",
                '/service/' + $scope.serviceId
            ).then(function successCallback(html) {
                var serviceMetadata = html.data.service;
                $scope.serviceId = serviceMetadata.serviceId;
                $scope.describeUrl = serviceMetadata.url;
                $scope.describeMetadata = serviceMetadata.resourceMetadata;
                // $scope.inputs = serviceMetadata.inputs;
                // $scope.outputs = serviceMetadata.outputs;
                // processServiceInputs($scope.inputs);
                // processServiceOutputs($scope.outputs);
                console.log($scope.serviceId);
            }, function errorCallback(response) {
                console.log("service.controller describe fail");
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

        $scope.registerService = function() {
            $scope.errorMsg = "";

            var data = {
                "url":$scope.serviceUrl,
                "contractUrl":$scope.serviceUrl,
                "resourceMetadata" : {
                    "name":$scope.serviceName,
                    "description":$scope.serviceDescription,
                    "method":$scope.method
                }
            };

            gateway.async(
                "POST",
                '/service',
                data
            ).then(function successCallback( html ) {

                $scope.registerServiceId = html.data.serviceId;
                console.log($scope.registerServiceId);
                $scope.showRegistrationSuccess = true;
                $scope.registrationSuccess = $scope.registerServiceId;
                $scope.serviceName = "";
                $scope.serviceDescription = "";
                $scope.serviceUrl = "";
                $scope.method = "";

                toaster.pop("success","Success",  "The service was registered successfully.")

            }, function errorCallback(response){
                console.log("service.controller Registration fail");
                toaster.pop('error', "Error", "There was an issue with your registration request.");
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
           //var executeServiceData = {
            //   "serviceId" : $scope.serviceId,
            //   "dataInputs" : $scope.executeInputMap,
            //   "dataOutput" : $scope.outputs[$scope.selectedOutput].dataType
           //};
            var data = $scope.resourceResult;

            gateway.async(
                "POST",
                '/v2/job',
                data
            ).then(function successCallback( html ) {
                $scope.jobId = html.data.jobId;
                $scope.ExecuteResultsRetries = 0;
                getExecuteResult($scope.jobId)


            }, function errorCallback(response){
                console.log("service.controller execution fail");
                toaster.pop('error', "Error", "There was an issue with your execution request.");
            });

        };

        $scope.getServices = function(pageNumber) {
            usSpinnerService.spin("spinner-list");

            $scope.services = [];
            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }

            var params = {
                page: $scope.pagination.current,
                per_page: $scope.listPerPage
            };

            gateway.async(
                "GET",
                "/service",
                undefined,
                params
            ).then(function successCallback( html ) {
                usSpinnerService.stop("spinner-list");
                $scope.services = angular.fromJson(html.data.data);
                $scope.totalServices = html.data.pagination.count;
            }, function errorCallback(response){
                usSpinnerService.stop("spinner-list");
                console.log("service.controller list services fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the services.");
            });

        };

        $scope.getListStart = function () {
            return ($scope.pagination.current * $scope.listPerPage) + 1;
        };

        $scope.getListEnd = function () {
            var end = ($scope.pagination.current * $scope.listPerPage) + $scope.listPerPage;
            if (end > $scope.totalServices) {
                return $scope.totalServices;
            }
            return end;
        };

        $scope.searchServices = function( pageNumber ) {

            $scope.services = [];
            if (pageNumber) {
                $scope.searchPagination.current = pageNumber - 1;
            }

            var params = {
                keyword: $scope.searchField,
                page: $scope.searchPagination.current,
                per_page: $scope.searchPerPage
            };

            gateway.async(
                "GET",
                "/service",
                undefined,
                params
            ).then(function successCallback( html ) {
                $scope.results = angular.fromJson(html.data.data);
                $scope.totalSearchResults = html.data.pagination.count;
            }, function errorCallback(response){
                console.log("service.controller fail on search");
                toaster.pop('error', "Error", "There was an issue with your search request.");
            });

        };

        $scope.getSearchStart = function () {
            return ($scope.searchPagination.current * $scope.searchPerPage) + 1;
        };

        $scope.getSearchEnd = function () {
            var end = ($scope.searchPagination.current * $scope.searchPerPage) + $scope.searchPerPage;
            if (end > $scope.totalSearchResults) {
                return $scope.totalSearchResults;
            }
            return end;
        };


        $scope.cancelUpdateService = function() {
            $scope.showUpdateService = !$scope.showUpdateService;
        };


        $scope.showUpdateServiceForm = function(serviceId){
            usSpinnerService.spin('spinner-update');

            if (!$scope.showUpdateService){
                $scope.showUpdateService = true;
            }
            else{
                $scope.showUpdateService = false;
            }

            gateway.async(
                "GET",
                '/service/' + serviceId
            ).then(function successCallback( html ) {
                usSpinnerService.stop('spinner-update');
                console.log(html);

                var results = angular.fromJson(html.data.service);
                $scope.updateResourceId = results.serviceId;
                $scope.updateServiceName = results.resourceMetadata.name;
                $scope.updateServiceDescrip = results.resourceMetadata.description;
                $scope.updateServiceUrl = results.url;
                $scope.updateServiceMethod = results.resourceMetadata.method;
            }, function errorCallback(response){
                usSpinnerService.stop("spinner-update");
                console.log("service.controller describe service fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the service.");
            });

        };

        $scope.updateService = function(){
            var serviceId = $scope.updateResourceId;


            if (!$scope.showUpdateService){
                $scope.showUpdateService = true;
            }
            else{
                $scope.showUpdateService = false;
            }

            var dataObj = {
                url: $scope.updateServiceUrl,
                contractUrl: $scope.updateServiceUrl,
                resourceMetadata: {
                    name: $scope.updateServiceName,
                    description: $scope.updateServiceDescrip,
                    method: $scope.updateServiceMethod
                }
            };

            gateway.async(
                "PUT",
                "/service/" + serviceId,
                dataObj
            ).then(function successCallback(res) {
                console.log(res);
                $scope.getServices();

                toaster.pop('success', "Success", "The service was successfully updated.")
            }, function errorCallback(res) {
                console.log("service.controller update fail: "+res.status);

                toaster.pop('error', "Error", "There was a problem updating the service.");
            });

            $scope.updateResourceId = "";
            $scope.updateServiceName = "";
            $scope.updateServiceDescrip = "";
            $scope.updateServiceUrl = "";
        };

        $scope.deleteService = function(serviceId){

            gateway.async(
                "DELETE",
                "/service/" + serviceId
            ).then(function successCallback(res) {
                console.log(res);

                $scope.getServices();
                toaster.pop('success', "Success", "The service was successfully deleted.")
            }, function errorCallback(res) {
                console.log("service.controller delete fail: "+res.status);

                toaster.pop('error', "Error", "There was a problem deleting the Service.");
            });
        };

    }
})();
