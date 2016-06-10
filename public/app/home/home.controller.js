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
        .controller('HomeController', ['$scope', '$http', 'discover', 'gateway', 'Auth', 'CONST', '$rootScope', HomeController]);

    function HomeController ($scope, $http, discover, gateway, Auth, CONST, $rootScope) {
        $scope.auth = Auth[CONST.isLoggedIn];

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
            }).then(function successCallback(html) {
                $scope.loggerStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response) {
                $scope.loggerStatus = "red";
                console.log("home.controller fail logger status");
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.uuidHost + "/"
            }).then(function successCallback(html) {
                $scope.uuidStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response) {
                $scope.uuidStatus = "red";
                console.log("home.controller fail uuidgen status");
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.workflowHost + "/"
            }).then(function successCallback(html) {
                $scope.workflowStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response) {
                $scope.workflowStatus = "red";
                console.log("home.controller fail workflow status");
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.searchHost + "/",
                transformResponse: function(value){
                    return value;
                }
            }).then(function successCallback(html) {
                $scope.searchStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response) {
                $scope.searchStatus = "red";
                console.log("home.controller fail search query status");
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.serviceControllerHost + "/"
            }).then(function successCallback(html) {
                $scope.serviceControllerStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response) {
                $scope.serviceControllerStatus = "red";
                console.log("home.controller fail service controller status");
            });
            $http({
                method: "GET",
                url: "/proxy/" + discover.dispatcherHost + "/",
                transformResponse: function(value){
                    return value;
                }
            }).then(function successCallback(html) {
                $scope.dispatcherStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response) {
                $scope.dispatcherStatus = "red";
                console.log("home.controller fail dispatcher status");
            });

            gateway.async(
                "GET",
                "/",
                null,
                null,
                true
            ).then(function successCallback( html ) {
                $scope.gatewayStatus = (html.status === 200) ? "green" : "red";
            }, function errorCallback(response){
                $scope.gatewayStatus = "red";
                console.log("home.controller fail gateway status");
            });
        };

    }

})();