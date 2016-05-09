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
        .controller('LoginController', ['$scope', '$location', '$sessionStorage', "$http", "discover", "toaster", "Auth", LoginController]);

    function LoginController ($scope, $location, $sessionStorage, $http, discover, toaster, Auth) {
        $sessionStorage.auth = Auth;
        $scope.login = function() {
            var data = {
                username: $scope.username,
                credential: $scope.password
            };
            $http({
                method: "POST",
                url: "/proxy?url=" + discover.securityHost + "/verification",
                data: data
            }).then(function successCallback( html ) {
                if (html.data) {
                    $sessionStorage.auth.isLoggedIn = true;
                    $location.path("/index.html");
                    toaster.pop('success', "Success", "You have logged in successfully.");
                } else {
                    $sessionStorage.auth.isLoggedIn = false;
                    $location.path("/login.html");
                    console.log("login.controller fail: "+html.status);
                    toaster.pop('warning', "Invalid Credentials", "You have entered the wrong username or password.");
                }
            }, function errorCallback(response){
                console.log("login.controller fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with authentication.");
            });

        };
    }

})();