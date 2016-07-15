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
        .controller('UuidAdminController', ['$scope', '$http', '$log', '$q','toaster', 'discover', UuidAdminController]);

    function UuidAdminController ($scope, $http, $log, $q, toaster, discover) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.uuidHost + "/admin/stats"
            }).then(function successCallback( html ) {
                $scope.adminData = html.data.data;
                console.log($scope.adminData);
            }, function errorCallback(response){
                console.log("uuid.admin.controller status fail: "+response.status);
                toaster.pop('error', "Error", "There was a problem retrieving the admin data.")
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
                    url: "/proxy?url=" + discover.uuidHost + "/admin/shutdown",
                    data: data
                }).then(function successCallback( html ) {
                    $scope.shutdownResponse = html.data;
                }, function errorCallback(response){
                    // 502 means the service was killed
                    if (response.status == "502") {
                        toaster.pop('success', "Success", "Service successfully shutdown");
                    }
                    else {
                        toaster.pop('error', "Error", "There was a problem with the shutdown.  Please try again later.")
                    }

                });

        };

    }

})();