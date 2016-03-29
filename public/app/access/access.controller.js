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
(function() {
    'use strict';
    angular
        .module('SAKapp')
        .controller('AccessController', ['$scope', '$log', '$q', '$http', 'toaster', 'discover', AccessController]);

    function AccessController($scope, $log, $q, $http, toaster, discover) {
        $scope.pageSize = 10;
        $scope.page = 0;

        var getCount = function() {
            $http({
                method: "GET",
                url: "/proxy/" + discover.accessHost + "/data/count",
            }).then(function successCallback(html) {
                $scope.total = html.data;
                $scope.maxPage = Math.ceil($scope.total / $scope.pageSize) - 1;
            }, function errorCallback(response) {
                console.log("access.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        $scope.getData = function($event) {
            getCount();
            var params = {
                page: $scope.page,
                pageSize: $scope.pageSize
            };
            $http({
                method: "GET",
                url: "/proxy/" + discover.accessHost + "/data",
                params: params
            }).then(function successCallback(html) {
                $scope.accessDataList = html.data;
            }, function errorCallback(response) {
                console.log("access.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        $scope.getAccess = function() {
            if (angular.isUndefined($scope.dataId) || $scope.dataId == "") {
                return;
            }
            $http({
                method: "GET",
                url: "/proxy/" + discover.accessHost + "/data/" + $scope.dataId
            }).then(function successCallback(html) {
                $scope.accessData = html.data;
            }, function errorCallback(response) {
                console.log("access.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        $scope.downloadFile = function(accessData, isFromList) {
            var location;
            if (isFromList) {
                location = accessData.dataType.location;
            } else {
                location = accessData.data.dataType.location;
            }
            var url = "http://" + location.bucketName + "." + location.domainName + "/" + location.fileName;
            window.location=url;
        };

        $scope.prevPage = function() {
            if ($scope.page > 0) {
                $scope.page--;
                $scope.getData();
            }
        };

        $scope.nextPage = function() {
            if ($scope.page < $scope.maxPage) {
                $scope.page++;
                $scope.getData();
            }
        };

        $scope.firstResultOnPage = function() {
            return ($scope.page * $scope.pageSize) + 1;
        };

        $scope.lastResultOnPage = function() {
            var lastItem = ($scope.page + 1) * $scope.pageSize;
            if (lastItem > $scope.total) {
                return $scope.total;
            }
            return lastItem;
        };

    }
})();
