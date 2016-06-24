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
(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('JobsController', ['$scope', '$http', 'toaster', 'discover', 'gateway', JobsController]);

        function JobsController ($scope, $http, toaster, discover, gateway) {
            $scope.pageSizeOptions = [10, 25, 50, 100, 500];
            $scope.orderOptions = ['descending', 'ascending'];
            $scope.order = 'descending';
            $scope.pageSize = 10;
            $scope.page = 0;
            $scope.pagination = {
                current: 0
            };
            $scope.pageChanged = function(newPage) {
                $scope.figureOutPageChange(true, newPage);
            };
            $scope.jobStatusQuery = "All";
            var BY_JOB_STATUS = "byJobStatus";
            var BY_USER_ID = "byUserId";

            // If pageSize or Job Status change, move back to the first page
            $scope.$watchGroup(["pageSize", "order"], function(newValue, oldValue) {
                $scope.page = 0;
                if ($scope.jobStatusQuery) {
                    if ($scope.searchType == BY_JOB_STATUS) {
                        $scope.updateFilter(true);
                    } else if ($scope.searchType == BY_USER_ID) {
                        $scope.getJobsByUserId(true);
                    }
                }
            });
            $scope.figureOutPageChange = function(getCount, newPage) {
                if ($scope.jobStatusQuery) {
                    if ($scope.searchType == BY_JOB_STATUS) {
                        $scope.updateFilter(getCount, newPage);
                    } else if ($scope.searchType == BY_USER_ID) {
                        $scope.getJobsByUserId(getCount, newPage);
                    }
                }
            };
            $scope.$watch("jobStatusQuery", function(newValue, oldValue) {
                if (angular.isDefined(newValue)) {
                    $scope.page = 0;
                    $scope.updateFilter(true);
                }
            });
            $scope.$watch("searchType", function(newValue, oldValue) {
                if (angular.isDefined(newValue) && newValue == BY_JOB_STATUS) {
                    $scope.page = 0;
                    $scope.updateFilter(true);
                } else if (angular.isDefined(newValue) && newValue == BY_USER_ID) {
                    $scope.page = 0;
                    $scope.getJobsByUserId(true);
                }
            });

            $scope.getJobStatus = function() {

                gateway.async(
                    "GET",
                    "/job/" + $scope.jobId
                ).then(function successCallback( html ) {
                    $scope.jobStatusResult = html.data;
                }, function errorCallback(response){
                    console.log("jobs.controller fail on getJobStatus");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });
            };

            $scope.getResourceData = function() {

                gateway.async(
                    "GET",
                    "/data/" + $scope.resourceId
                ).then(function successCallback( html ) {
                    $scope.resourceData = html.data;
                }, function errorCallback(response){
                    console.log("jobs.controller fail on GetResourceData");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

            };


            $scope.getAllStatuses = function() {

                    $http({
                        method: "GET",
                        url: "/proxy?url=" + discover.jobsHost + "/job/status",
                    }).then(function successCallback( html ) {
                        $scope.jobStatuses = [];
                        $scope.jobStatuses.push.apply($scope.jobStatuses, html.data);
                        $scope.jobStatuses.push("All");
                    }, function errorCallback(response){
                        console.log("search.controller fail all statuses");
                        toaster.pop('error', "Error", "There was an issue with retrieving all possible statuses.");
                    });


            };


            $scope.updateFilter = function(getCount, pageNumber) {


                var query = "";
                if (angular.isDefined($scope.jobStatusQuery) && $scope.jobStatusQuery !== "" && $scope.jobStatusQuery !== "All") {
                    query = "/status/" + $scope.jobStatusQuery;
                }

                if (pageNumber) {
                    $scope.pagination.current = pageNumber - 1;
                }
                
                var params = {
                    page: $scope.pagination.current,
                    per_page: $scope.pageSize,
                    order: $scope.order
                };
                $http({
                    method: "GET",
                    url: "/proxy/" + discover.jobsHost + "/job" + query,
                    params: params
                }).then(function successCallback(html) {
                    $scope.jobsList = html.data;
                }, function errorCallback(response) {
                    console.log("search.controller fail updateFilter query");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

                if (getCount) {
                    $http({
                        method: "GET",
                        url: "/proxy/" + discover.jobsHost + "/job" + query + "/count"
                    }).then(function successCallback(html) {
                        $scope.total = html.data;
                    }, function errorCallback(response) {
                        console.log("search.controller fail  updateFilter count: " + response.status);
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });
                }

            };

            $scope.firstResultOnPage = function() {
                return ($scope.pagination.current * $scope.pageSize) + 1;
            };

            $scope.lastResultOnPage = function() {
                var lastItem = ($scope.pagination.current + 1) * $scope.pageSize;
                if (lastItem > $scope.total) {
                    return $scope.total;
                }
                return lastItem;
            };

            $scope.getJobsByUserId = function(getCount, pageNumber) {
                if (pageNumber) {
                    $scope.pagination.current = pageNumber - 1;
                }
                var params = {
                    page: $scope.pagination.current,
                    per_page: $scope.pageSize,
                    order: $scope.order
                };
                if (angular.isUndefined($scope.userId) || $scope.userId == "") {
                    return;
                }
                $http({
                    method: "GET",
                    url: "/proxy/" + discover.jobsHost + "/job/userName/" + $scope.userId,
                    params: params
                }).then(function successCallback(html) {
                    $scope.jobsList = html.data;
                }, function errorCallback(response) {
                    console.log("jobs.controller job by ID fail: " + response.status);
                    toaster.pop('error', "Error", "There was an issue with your job request.");
                });

                if (getCount) {
                    $http({
                        method: "GET",
                        url: "/proxy/" + discover.jobsHost + "/job/userName/" + $scope.userId,
                        params: {
                            page: 0,
                            per_page: 10000,
                            order: $scope.order
                        }
                    }).then(function successCallback(html) {
                        $scope.total = html.data.length;
                    }, function errorCallback(response) {
                        console.log("search.controller fail  updateFilter count: " + response.status);
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });
                }
            };
        }
})();
