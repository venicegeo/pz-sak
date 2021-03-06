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
        .controller('LoggerAdminController', ['$scope', '$http', 'toaster', 'discover', LoggerAdminController]);

    function LoggerAdminController ($scope, $http, toaster, discover) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.loggerHost + "/admin/stats"
            }).then(function( html ) {
                $scope.adminData = html.data.data;
            }, function(){
                toaster.pop('error', "Error", "There was an error retrieving the admin data");
            });

        };

        $scope.getUptime = function(dateString) {
            return moment.utc(dateString).fromNow();
        };

        $scope.reset = function() {

            var data = {
                reason: $scope.shutdownReason
            };
            $http({
                method: "POST",
                url: "/proxy?url=" + discover.loggerHost + "/admin/shutdown",
                data: data
            }).then(function( html ) {
                $scope.shutdownResponse = html.data;
            }, function(response) {
                // 502 means the service was killed
                if (response.status == "502") {
                    toaster.pop('success', "Success", "Service successfully shutdown");
                }

            });

        };

    }

})();
