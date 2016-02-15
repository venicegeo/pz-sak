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
                        url: "/proxy?url=pz-jobmanager.cf.piazzageo.io/job/status"
                        //url: "/proxy?url=" + result.data.host + "/job/status"
                    }).then(function successCallback( html ) {
                        $scope.jobStatuses = html.data;
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