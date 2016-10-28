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
        .controller('UserController', ['$scope', '$http',  'toaster', 'discover', 'settings', 'usSpinnerService', UserController]);

    function UserController ($scope, $http, toaster, discover, settings, usSpinnerService) {
        $scope.pageOptions = [10, 50, 100, 500];
        $scope.size=10;
        $scope.elasticSearchLimit = settings.elasticSearchLimit;

        $scope.pagination = {
            current: 0
        };

        $scope.pageChanged = function(newPage) {
            $scope.getUsers(newPage);
        };

        $scope.showHideSearchForm = function() {
            $scope.showSearchUsers = !$scope.showSearchUsers;
        };

        $scope.searchUsers = function() {
            $scope.getUsers();
        };

        $scope.getUsers = function (pageNumber) {
            usSpinnerService.spin('spinner');
            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }
            var params = {
                perPage : $scope.size,
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
            $scope.users = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy/" + discover.securityHost + "/user",
                params: params
            }).then(function( html ) {
                usSpinnerService.stop('spinner');
                $scope.users = html.data.data;
                $scope.actualUserCount = html.data.pagination.count;
                $scope.userCount = ($scope.actualUserCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualUserCount;
            }, function(){
                usSpinnerService.stop('spinner');
                toaster.pop('error', "Error", "There was an issue with retrieving the users.");
            });

        };

        $scope.updateUser = function(user){
            $scope.errorMsg = "";

            $http.put(
                "/proxy/" + discover.securityHost + "/user/" + user.name,
                user
            ).then(function(res) {
                $scope.message = res;
                toaster.pop('success', "Success", "The user was successfully updated.")
            }, function(res) {
                toaster.pop('error', "Error", "There was a problem updating the user.");
            });
        };

        $scope.getFirstIndex = function () {
            return ($scope.pagination.current * $scope.size) + 1;
        };

        $scope.getLastIndex = function () {
            var end = ($scope.pagination.current * $scope.size) + $scope.size;
            if (end > $scope.userCount) {
                return $scope.userCount;
            }
            return end;
        };

    }

})();
