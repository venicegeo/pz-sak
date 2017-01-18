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
        .controller('LoginController', ['$scope', '$sessionStorage', "discover", "toaster", "Auth", "CONST", LoginController]);

    function LoginController ($scope, $sessionStorage, discover, toaster, Auth, CONST) {
        $sessionStorage[CONST.auth] = Auth;
        var options = {
            backdrop: 'static',
            keyboard: false,
            show: true
        };
        // If you're not logged in and you didn't just logout
        if ($sessionStorage[CONST.auth][CONST.isLoggedIn] !== CONST.loggedIn) {
            $('#warningModal').modal(options);
        }

        $scope.login = function() {
            if (angular.isUndefined($scope.apikey) || $scope.apikey === "") {
                // For now, just have the user enter their API Key
                toaster.pop('error', 'Error', 'Please enter an api key.');
                return;
            }
            Auth.encode($scope.apikey, "");
            $sessionStorage[CONST.auth] = Auth;
            var redirect_uri="https://" + discover.sak + "/geoaxis";
            window.location.replace("/loginProxy?url="+redirect_uri);
        };

    }

})();