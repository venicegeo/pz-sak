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
        .controller('UserServiceController', ['$scope', 'toaster', '$timeout', 'spinnerService', 'gateway', 'settings', UserServiceController]);



    function UserServiceController($scope, toaster, $timeout, spinnerService, gateway, settings) {
        $scope.elasticSearchLimit = settings.elasticSearchLimit;
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

        function getResourceResult(resourceId){

            gateway.async(
                "GET",
                '/data/' + resourceId
            ).then(function(html) {
                $scope.resourceResult = "";
                $scope.executeSuccess = JSON.stringify(html.data.data.dataId);
                $scope.showExecuteSuccess = true;
                toaster.pop("success","Success",  "The service was executed successfully.")
            }, function() {
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        }
        function getExecuteResult(jobId) {
            $scope.ExecuteResultsRetries += 1;

            gateway.async(
                "GET",
                '/job/' + $scope.jobId
            ).then(function(html) {
                if (html.data.data.status.indexOf("Success") > -1) {
                    if ($scope.spinnerExecute) {
                        spinnerService.hide("spinner-execute");
                    }
                    $scope.dataId = html.data.data.result.dataId;
                    getResourceResult($scope.dataId);
                    $scope.jobStatusResult = JSON.stringify(html.data.data);
                }
                else {
                    if ($scope.ExecuteResultsRetries < $scope.maxExecuteResultsRetries) {
                        $timeout(getExecuteResult, SLOW_POLL, jobId);
                    }
                    else {
                        if ($scope.spinnerExecute) {
                            spinnerService.hide("spinner-execute");
                        }
                        toaster.pop('error', "Error", "Exceeded Get Execute Results retry limit")
                    }
                }
            }, function(response) {
                if ((response.data.message == "Job Not Found.") &&
                    ($scope.ExecuteResultsRetries < $scope.maxExecuteResultsRetries)) {
                    $timeout(getExecuteResult, SLOW_POLL, jobId);
                } else {
                    if ($scope.spinnerExecute) {
                        spinnerService.hide("spinner-execute");
                    }
                    toaster.pop('error', "Error", "There was an issue with your request.");
                }
            });
        }

        $scope.describeService = function() {
            gateway.async(
                "GET",
                '/service/' + $scope.serviceId
            ).then(function(html) {
                var serviceMetadata = html.data.service;
                $scope.serviceId = serviceMetadata.serviceId;
                $scope.describeUrl = serviceMetadata.url;
                $scope.describeMetadata = serviceMetadata.resourceMetadata;
            }, function() {
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        };


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
            };

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
            };

            $scope.registerOutputs.push(newOutput);
        };

        $scope.addFormat = function($index) {
            var newFormat = {
                "mimeType" : "application/json",
                "encoding" : null,
                "schema" : null,
                "maximumMegabytes" : null,
                "dataType" : null
            };
            $scope.registerInputs[$index].formats.push(newFormat);
        };
        $scope.addOutputFormat = function($index) {
            var newFormat = {
                "mimeType" : "application/json",
                "encoding" : null,
                "schema" : null,
                "maximumMegabytes" : null,
                "dataType" : null
            };
            $scope.registerOutputs[$index].formats.push(newFormat);
        };

        $scope.registerService = function() {
            $scope.errorMsg = "";

            var data = {
                "url":$scope.serviceUrl,
                "contractUrl":$scope.serviceUrl,
                "method":$scope.method,
                "resourceMetadata" : {
                    "name":$scope.serviceName,
                    "description":$scope.serviceDescription,
                    "classType": ""
                }
            };

            gateway.async(
                "POST",
                '/service',
                data
            ).then(function( html ) {

                $scope.registerServiceId = html.data.data.serviceId;
                $scope.showRegistrationSuccess = true;
                $scope.registrationSuccess = $scope.registerServiceId;
                $scope.serviceName = "";
                $scope.serviceDescription = "";
                $scope.serviceUrl = "";
                $scope.method = "";

                toaster.pop("success","Success",  "The service was registered successfully.");

            }, function(){
                toaster.pop('error', "Error", "There was an issue with your registration request.");
            });

        };

        function createExecuteInputMap(inputs) {
            //executeInputMap
            var i = 0;
            for (; i < inputs.length; i++) {
                switch (inputs[i].dataType.type) {
                    case "urlparameter":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": "text"
                        };
                        break;
                    case "body":
                    case "raster":
                    case "text":
                        $scope.executeInputMap[inputs[i].name] = {
                            "content": inputs[i].content,
                            "type": inputs[i].dataType.type,
                            "mimeType": inputs[i].formatSelect
                        };
                        break;
                }
            }
        }
        $scope.executeService = function() {
            createExecuteInputMap($scope.inputs);
            $scope.executeMsg = "";
            var data = $scope.resourceResult;

            gateway.async(
                "POST",
                '/job',
                data
            ).then(function( html ) {
                $scope.jobId = html.data.data.jobId;
                $scope.ExecuteResultsRetries = 0;
                if ($scope.spinnerExecute) {
                    spinnerService.show("spinner-execute");
                }
                getExecuteResult($scope.jobId)
            }, function(){
                toaster.pop('error', "Error", "There was an issue with your execution request.");
            });

        };

        $scope.getServices = function(pageNumber) {
            if ($scope.spinnerList) {
                spinnerService.show("spinner-list");
            }
            $scope.services = [];
            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }

            var params = {
                page: $scope.pagination.current,
                perPage: $scope.listPerPage
            };

            gateway.async(
                "GET",
                "/service",
                undefined,
                params
            ).then(function( html ) {
                if ($scope.spinnerList) {
                    spinnerService.hide("spinner-list");
                }
                $scope.services = angular.fromJson(html.data.data);
                $scope.actualServicesCount = html.data.pagination.count;
                $scope.totalServices = ($scope.actualServicesCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualServicesCount;
            }, function(){
                if ($scope.spinnerList) {
                    spinnerService.hide("spinner-list");
                }
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
                perPage: $scope.searchPerPage
            };

            gateway.async(
                "GET",
                "/service",
                undefined,
                params
            ).then(function( html ) {
                $scope.results = angular.fromJson(html.data.data);
                $scope.totalSearchResults = html.data.pagination.count;
            }, function(){
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
            if ($scope.spinnerUpdate) {
                spinnerService.show('spinner-update');
            }
            $scope.showUpdateService = !$scope.showUpdateService;

            gateway.async(
                "GET",
                '/service/' + serviceId
            ).then(function( html ) {
                if ($scope.spinnerUpdate) {
                    spinnerService.hide('spinner-update');
                }
                var results = angular.fromJson(html.data.service);
                $scope.updateResourceId = results.serviceId;
                $scope.updateServiceName = results.resourceMetadata.name;
                $scope.updateServiceDescrip = results.resourceMetadata.description;
                $scope.updateServiceUrl = results.url;
                $scope.updateServiceMethod = results.method;
            }, function(){
                if ($scope.spinnerUpdate) {
                    spinnerService.hide("spinner-update");
                }
                toaster.pop('error', "Error", "There was an issue with retrieving the service.");
            });

        };

        $scope.updateService = function(){
            var serviceId = $scope.updateResourceId;


            $scope.showUpdateService = !$scope.showUpdateService;

            var dataObj = {
                url: $scope.updateServiceUrl,
                contractUrl: $scope.updateServiceUrl,
                method: $scope.updateServiceMethod,
                resourceMetadata: {
                    name: $scope.updateServiceName,
                    description: $scope.updateServiceDescrip
                }
            };

            gateway.async(
                "PUT",
                "/service/" + serviceId,
                dataObj
            ).then(function(res) {
                if (res.status == "200") {
                    $scope.getServices();
                    toaster.pop('success', "Success", "The service was successfully updated.");
                } else {
                    toaster.pop('error', "Error", "There was a problem updating the service");
                }
            }, function() {
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
            ).then(function() {
                $scope.getServices();
                toaster.pop('success', "Success", "The service was successfully deleted.")
            }, function() {
                toaster.pop('error', "Error", "There was a problem deleting the Service.");
            });
        };

        $scope.spinnerListLoaded = function() {
            $scope.spinnerList = true;
        };

        $scope.spinnerExecuteLoaded = function() {
            $scope.spinnerExecute = true;
        };

        $scope.spinnerUpdateLoaded = function() {
            $scope.spinnerUpdate = true;
        };

    }
})();
