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
        .controller('LoginController', ['$scope', '$location', '$cookies', "$http", "discover", "toaster", "Auth", "CONST", "$rootScope", LoginController]);

    function LoginController ($scope, $location, $cookies, $http, discover, toaster, Auth, CONST, $rootScope) {
        $cookies.putObject(CONST.auth, Auth);
        $scope.login = function() {
            if (angular.isUndefined($scope.apikey) || $scope.apikey === "") {
                // there's a problem for now but in the future just request an apikey
                toaster.pop('error', 'Error', 'Please enter an api key.');
                return;
            }
            $rootScope.apikey = $scope.apikey;
            var redirect_uri="https://" + discover.sak + "/geoaxis";
            //window.location.replace("https://"+ discover.sak +"/loginProxy?url="+redirect_uri);
            window.location.replace("https://localhost/loginProxy?url="+redirect_uri);
        };

        /*$scope.login = function() {
            var id = Auth.encode($scope.username, $scope.pass);
            $http({
                method: "GET",
                url: "/proxy?url=" + discover.gatewayHost + "/key",
                headers: {
                    "Authorization": "Basic " + id
                }
            }).then(function successCallback( html ) {
                if (html.data.type === "uuid") {
                    Auth[CONST.isLoggedIn] = CONST.loggedIn;
                    Auth.encode(html.data.uuid, "");
                    Auth.setUser($scope.username);
                    $cookies.putObject(CONST.auth, Auth);
                    $location.path("/index.html");
                    $rootScope.$emit('loggedInEvent');
                    $scope.username = "";
                    $scope.pass = "";
                    toaster.pop('success', "Success", "You have logged in successfully.");
                } else {
                    console.log("verification success but no ID present");
                    toaster.pop('error', 'Error', 'An error was encountered while logging in. Please try again later.')
                }
            }, function errorCallback(){
                Auth[CONST.isLoggedIn] = "aiefjkd39dkal3ladfljfk2kKA3kd";
                Auth.encode("null", "null");
                Auth.setUser("");
                $cookies.putObject(CONST.auth, Auth);
                $location.path("/login.html");
                $scope.pass = "";
                toaster.pop('warning', "Invalid Credentials", "You have entered the wrong username or password.");
            });

        };*/
    }

})();