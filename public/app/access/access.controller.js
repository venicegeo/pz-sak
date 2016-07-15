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
        .controller('AccessController', ['$scope', 'toaster', 'gateway', AccessController]);

    function AccessController($scope, toaster, gateway) {
        $scope.pageSize = 10;
        $scope.page = 0;

        $scope.pagination = {
            current: 0
        };
        $scope.pageOptions = [10, 25, 50, 100, 500];
        $scope.pageChanged = function(newPage) {
            $scope.getData(newPage);
        };
        $scope.getStart = function () {
            return ($scope.pagination.current * $scope.pageSize) + 1;
        };
        $scope.getEnd = function () {
            var end = ($scope.pagination.current * $scope.pageSize) + $scope.pageSize;
            if (end > $scope.total) {
                return $scope.total;
            }
            return end;
        };

        $scope.getData = function(pageNumber) {
            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }
            var params = {
                page: $scope.pagination.current,
                perPage: $scope.pageSize
            };
            gateway.async(
                "GET",
                "/data",
                undefined,
                params
            ).then(function successCallback(html) {
                $scope.accessDataList = html.data.data;
                $scope.total = html.data.pagination.count;
            }, function errorCallback(response) {
                console.log("access.controller get data fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        $scope.getAccess = function() {
            if (angular.isUndefined($scope.dataId) || $scope.dataId == "") {
                return;
            }
            gateway.async(
                "GET",
                "/data/" + $scope.dataId
            ).then(function successCallback(html) {
                $scope.accessData = html.data.data;
            }, function errorCallback(response) {
                console.log("access.controller get access fail: " + response.status);
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
    }
})();
