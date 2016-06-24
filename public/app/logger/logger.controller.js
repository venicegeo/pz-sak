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
        .controller('LoggerController', ['$scope', '$http',  'toaster', 'discover', 'usSpinnerService', LoggerController]);

    function LoggerController ($scope, $http, toaster, discover, usSpinnerService) {
        $scope.pageOptions = [10, 50, 100, 500];
        $scope.size=100;

        $scope.pagination = {
            current: 0
        };
        
        $scope.pageChanged = function(newPage) {
            $scope.getLogs(newPage);
        };

        $scope.showHideSearchForm = function() {
            $scope.showSearchLogs = !$scope.showSearchLogs;
        };

        $scope.searchLogs = function() {
            $scope.getLogs();
        };

        $scope.getLogs = function (pageNumber) {
            usSpinnerService.spin('spinner');
            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }
            var params = {
                per_page : $scope.size,
                page : $scope.pagination.current
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
                usSpinnerService.stop('spinner');
                $scope.logs = html.data.data;
                $scope.logCount = html.data.pagination.count;
            }, function errorCallback(response){
                usSpinnerService.stop('spinner');
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

        $scope.getFirstIndex = function () {
            return ($scope.pagination.current * $scope.size) + 1;
        };

        $scope.getLastIndex = function () {
            var end = ($scope.pagination.current * $scope.size) + $scope.size;
            if (end > $scope.logCount) {
                return $scope.logCount;
            }
            return end;
        };

    }

})();