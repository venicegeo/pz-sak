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
        .controller('LoggerController', ['$scope', '$http', '$log', '$q',  'toaster', 'discover', LoggerController]);

    function LoggerController ($scope, $http, $log, $q, toaster, discover) {
        $scope.pageOptions = [10, 50, 100, 500];
        $scope.size=100;
        $scope.from=0;

        $scope.$watch("size", function(newValue, oldValue) {
            $scope.from=0;
            $scope.getLogs();
        });

        $scope.showHideSearchForm = function() {
            $scope.showSearchLogs = !$scope.showSearchLogs;
        };


        $scope.searchLogs = function() {
            //TODO:Once Logger Search API is updated, we need to update this call to pass search params and show only what is returned.
            $scope.getLogs();
        };

        $scope.getLogs = function () {
            var params = {
                per_page : $scope.size,
                page : $scope.from
            };
            if ($scope.afterDate) {
                angular.extend(params, {
                    after: moment($scope.afterDate).unix()
                });
            }
            if ($scope.beforeDate) {
                angular.extend(params, {
                    before: moment($scope.beforeDate).unix()
                });
            }
            if ($scope.service) {
                angular.extend(params, {
                    service: $scope.service
                });
            }
            if ($scope.contains) {
                angular.extend(params, {
                    contains: $scope.contains
                });
            }
            $scope.logs = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy/" + discover.loggerHost + "/v2/message",
                params: params
            }).then(function successCallback( html ) {
                $scope.logs = html.data.data;
                $scope.logCount = html.data.pagination.count;

            }, function errorCallback(response){
                console.log("logger.controller get logs fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the logs.");
            });

        };

        $scope.postLog = function(){
            $scope.errorMsg = "";

            var currentTime = moment().unix();
            var logMessage = $scope.logMessage;
            var dataObj = {
                service: "sakui-log-tester",
                address: "128.1.2.3",
                stamp: currentTime,
                severity: "Info",
                message: logMessage
            };

            $http.post(
                "/proxy?url=" + discover.loggerHost + "/v2/message",
                dataObj
            ).then(function successCallback(res) {
                $scope.message = res;
                $scope.getLogs();
                $scope.logMessage = null;
                toaster.pop('success', "Success", "The log was successfully posted.")
            }, function errorCallback(res) {
                console.log("logger.controller post log fail: "+res.status);
                toaster.pop('error', "Error", "There was a problem submitting the log message.");
            });
        };

        $scope.nextPage = function() {
            if ($scope.from < $scope.logCount-$scope.size) {
                $scope.from += $scope.size;
                $scope.getLogs();
            }
        };

        $scope.prevPage = function() {
            if ($scope.from > 0) {
                $scope.from -= $scope.size;
                $scope.getLogs();
            }
        };

        $scope.getLastIndex = function() {
            var endingPoint = $scope.from + $scope.size;
            if (endingPoint > $scope.logCount) {
                endingPoint = $scope.logCount;
            }
            return endingPoint;
        };

    }

})();