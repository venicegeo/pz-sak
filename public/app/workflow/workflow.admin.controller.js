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

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('WorkflowAdminController', ['$scope', '$http', '$log', '$q', 'toaster',  WorkflowAdminController]);

    function WorkflowAdminController ($scope, $http, $log, $q, toaster) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/admin/stats",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;

                }, function errorCallback(response){
                    console.log("fail");
                    toaster.pop('error', "Error", "There was an error retrieving the admin workflow data");
                    //$scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };
        $scope.getSettings = function () {
            $scope.settingsData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/admin/settings",
                }).then(function successCallback( html ) {
                    $scope.settingsData = html.data;
                }, function errorCallback(response){
                    console.log("fail");
                    toaster.pop('error', "Error", "There was an error retrieving the admin settings data");

                });

            });

        };
        $scope.postSettings = function(){
            $scope.errorMsg = "";

            var currentTime = moment().utc().toISOString();
            var workflowMessage = $scope.workflowMessage;
            var dataObj = {
                debug: "true"
            }
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {


                $http.post(
                    "/proxy?url=" + result.data.host + "/v1/admin/settings",
                    dataObj
                ).then(function successCallback(res) {
                    $scope.settings = res;
                    $scope.workflowMessage = null;
                    toaster.pop('success', "Success", "The admin settings was successfully posted.")

                }, function errorCallback(res) {
                    console.log("workflow.controller fail"+res.status);
                    toaster.pop('error', "Error", "There was a problem submitting the admin settings.");
                });
            })
        };

        $scope.getUptime = function(dateString) {
            return moment.utc(dateString).fromNow();
        };

        $scope.reset = function() {

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                var data = {
                    reason: $scope.shutdownReason
                };
                $http({
                    method: "POST",
                    url: "/proxy?url=" + result.data.host + "/v1/admin/shutdown",
                    data: data
                }).then(function successCallback( html ) {
                    $scope.shutdownResponse = html.data;
                }, function errorCallback(response) {
                    // 502 means the service was killed
                    if (response.status == "502") {
                        toaster.pop('success', "Success", "Service successfully shutdown");
                    }
                });

            });

        };

    }

})();