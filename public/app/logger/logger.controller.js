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

        $scope.showHideSearchForm = function() {
            $scope.showSearchLogs = !$scope.showSearchLogs;
        };


        $scope.searchLogs = function() {
            //TODO:Once Logger Search API is updated, we need to update this call to pass search params and show only what is returned.
        };

        $scope.getLogs = function () {
            $scope.logs = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.loggerHost + "/v1/messages",
            }).then(function successCallback( html ) {
                $scope.logs = html.data;
            }, function errorCallback(response){
                console.log("logger.controller fail"+response.status);
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
                "/proxy?url=" + discover.loggerHost + "/v1/messages",
                dataObj
            ).then(function successCallback(res) {
                $scope.message = res;
                $scope.getLogs();
                $scope.logMessage = null;
                toaster.pop('success', "Success", "The log was successfully posted.")
            }, function errorCallback(res) {
                console.log("logger.controller fail"+res.status);
                toaster.pop('error', "Error", "There was a problem submitting the log message.");
            });
        }
    }

})();