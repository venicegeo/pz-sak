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
        .controller('JobsController', ['$scope', '$log', '$q', '$http', 'toaster',  JobsController]);

        function JobsController ($scope, $log, $q, $http, toaster) {
            $scope.pageSizeOptions = [10, 50, 100];
            $scope.pageSize = 10;
            $scope.page = 0;

            // If pageSize or Job Status change, move back to the first page
            $scope.$watch("[pageSize,jobStatusQuery]", function(newValue, oldValue) {
                $scope.page = 0;
            });

            $scope.getJobStatus = function() {

                $http({
                    method: "GET",
                    url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
                }).then(function(result) {

                    var data = {
                        "apiKey": "my-api-key-kidkeid",
                        "jobType": {
                            "type": "get",
                            "jobId": $scope.jobId
                        }
                    };
                    //var data = "{" +
                    //    "'apiKey': 'my-api-key-kdjfkaj'," +
                    //    "'jobType': {" +
                    //    "'type': 'get'," +
                    //    " 'jobId': '" + $scope.jobId +
                    //"' }}";
                    var fd = new FormData();
                    fd.append( 'body', data );

                    var params = {
                        body: data,
                        file: ""
                    };

                    $http({
                        method: "POST",
                        url: "/proxy/pz-gateway.cf.piazzageo.io/job",
                        //url: "/proxy/" + result.data.host + "/job",
                        params: data,
                        data: data,
                        //headers: {
                        //    "Content-Type": "multipart/form-data",
                        //    "Content-Disposition": "form-data"
                        //}
                        transformRequest: function(data) {
                            var formData = new FormData();
                            formData.append('data', data);
                            return formData;
                        }
                    }).then(function successCallback( html ) {
                        $scope.jobStatusResult = html.data.jobStatus;
                    }, function errorCallback(response){
                        console.log("search.controller fail");
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });

                });

            };

            $scope.getResourceData = function() {

                $http({
                    method: "GET",
                    url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
                }).then(function(result) {

                    var data = {
                        "apiKey": "my-api-key-kidkeid",
                        "jobType": {
                            "type": "get-resource",
                            "resourceId": $scope.resourceId
                        }
                    };
                    $http({
                        method: "POST",
                        url: "/proxy?url=" + result.data.host + "/job",
                        data: data
                    }).then(function successCallback( html ) {
                        $scope.resourceData = html.data.resourceId;
                    }, function errorCallback(response){
                        console.log("search.controller fail");
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });

                });
            };


            $scope.getAllStatuses = function() {

                $http({
                    method: "GET",
                    url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
                }).then(function(result) {

                    $http({
                        method: "GET",
                        url: "/proxy?url=pz-jobmanager.cf.piazzageo.io/job/status",
                        headers: {
                            Accept: "application/xml"
                        }
                        //url: "/proxy?url=" + result.data.host + "/job/status"
                    }).then(function successCallback( html ) {
                        var d = jQuery.parseXML(html.data);
                        $scope.jobStatuses = [];
                        var childNodes = d.childNodes[0].childNodes;
                        for (var i = 0; i < childNodes.length; i++) {
                            $scope.jobStatuses.push(childNodes[i].textContent)
                        }
                        $scope.jobStatuses.push("All");
                    }, function errorCallback(response){
                        console.log("search.controller fail");
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });

                });

            };


            $scope.updateFilter = function() {

                $http({
                    method: "GET",
                    url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
                }).then(function(result) {

                    var query = "";
                    if (angular.isDefined($scope.jobStatusQuery) && $scope.jobStatusQuery !== "" && $scope.jobStatusQuery !== "All") {
                        query = "/status/" + $scope.jobStatusQuery;
                    }

                    var params = {
                        page: $scope.page,
                        pageSize: $scope.pageSize
                    };
                    $http({
                        method: "GET",
                        url: "/proxy/pz-jobmanager.cf.piazzageo.io/job" + query,
                        //url: "/proxy?url=" + result.data.host + "/job/status"
                        params: params
                    }).then(function successCallback( html ) {
                        $scope.jobsList = html.data;
                    }, function errorCallback(response){
                        console.log("search.controller fail");
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });

                    $http({
                        method: "GET",
                        url: "/proxy/pz-jobmanager.cf.piazzageo.io/job" + query + "/count",
                        //url: "/proxy?url=" + result.data.host + "/job/status"
                        params: params
                    }).then(function successCallback( html ) {
                        $scope.total = html.data;
                        $scope.maxPage = Math.ceil( $scope.total / $scope.pageSize ) - 1;
                    }, function errorCallback(response){
                        console.log("search.controller fail");
                        toaster.pop('error', "Error", "There was an issue with your request.");
                    });
                });

            };

            $scope.prevPage = function() {
                if ($scope.page > 0) {
                    $scope.page--;
                    $scope.updateFilter();
                }
            };

            $scope.nextPage = function() {
                if ($scope.page < $scope.maxPage) {
                    $scope.page++;
                    $scope.updateFilter();
                }
            };

        }




})();