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
        .controller('HomeController', ['$scope', '$http', 'discover', 'gateway', 'Auth', 'CONST', '$rootScope', HomeController]);

    function HomeController ($scope, $http, discover, gateway, Auth, CONST, $rootScope) {
        $scope.auth = Auth[CONST.isLoggedIn];
        $scope.jenkinsUrl = config.jenkinsUrl;
        $scope.devOpsUrl = config.devOpsUrl;
        $scope.gitUrl = config.gitUrl;

        $rootScope.$on('loggedInEvent', function(event, args){
            $scope.getStatuses();
        });

        $scope.getRunningServices = function (){

            $scope.services = discover;

        };

        $scope.openPage = function(url) {
            // Might want to send creds for gateway call
            window.open('https://' + url, 'newwindow', 'width=300, height=250, top=300, left=300');
            return false;
        };

        $scope.getStatuses = function() {
            $http({
                method: "GET",
                url: "/proxy/" + discover.loggerHost + "/"
            }).then(function(html) {
                $scope.loggerStatus = (html.status === 200) ? "green" : "red";
            }, function() {
                $scope.loggerStatus = "red";
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.workflowHost + "/"
            }).then(function(html) {
                $scope.workflowStatus = (html.status === 200) ? "green" : "red";
            }, function() {
                $scope.workflowStatus = "red";
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.searchHost + "/",
                transformResponse: function(value){
                    return value;
                }
            }).then(function(html) {
                $scope.searchStatus = (html.status === 200) ? "green" : "red";
            }, function() {
                $scope.searchStatus = "red";
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.serviceControllerHost + "/"
            }).then(function(html) {
                $scope.serviceControllerStatus = (html.status === 200) ? "green" : "red";
            }, function() {
                $scope.serviceControllerStatus = "red";
            });

            gateway.async(
                "GET",
                "/",
                null,
                null,
                true
            ).then(function( html ) {
                $scope.gatewayStatus = (html.status === 200) ? "green" : "red";
            }, function(){
                $scope.gatewayStatus = "red";
            });
        };

    }

})();