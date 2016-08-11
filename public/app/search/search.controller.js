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

(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('SearchController', ['$scope', '$http', 'toaster', 'discover', 'gateway','settings', SearchController]);


    function SearchController($scope, $http, toaster, discover, gateway, settings) {
        $scope.elasticSearchLimit = settings.elasticSearchLimit;
        $scope.size = 100;

        $scope.pageOptions = [10, 25, 50, 100, 500];
        $scope.pagination = {
            current: 0
        };
        $scope.pageChanged = function(newPage) {
            $scope.getSearchResults(newPage);
        };

        $scope.getResultsCount = function(query) {
            $http({
                method: "POST",
                url: "/proxy/" + discover.searchHost + "/api/v1/recordcount",
                data: query
            }).then(function successCallback( html ) {
                $scope.actualResultsCount = html.data;
                $scope.totalResults = ($scope.actualResultsCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualResultsCount;
                if ($scope.totalResults == 0) {
                    $scope.errorMsg = "No results to display";
                }
            }, function errorCallback(response){
                console.log("search.controller results count fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        };

        $scope.getSearchResults = function(pageNumber) {
            $scope.errorMsg = "";
            $scope.tagMsg = "";
            if (pageNumber) {
                $scope.pagination.current = pageNumber - 1;
            }

            var q = "";

            if (!angular.isUndefined($scope.searchTerm) && $scope.searchTerm !== "") {
                q = {
                    "match": {
                        "_all": $scope.searchTerm
                    }
                };
            } else {
                q = {
                    "match_all": {}
                };
            }

            var data = {
                "query": q,
                "size": $scope.size,
                "from": $scope.pagination.current * $scope.size
            };

            $scope.getResultsCount(q);

            gateway.async(
                "POST",
                "/data/query",
                data
            ).then(function successCallback( html ) {
                $scope.searchResults = html.data.data;
            }, function errorCallback( response ) {
                console.log("search.controller get search results fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with your search request.");
            });

        };

        var isUndefinedOrEmpty = function(str) {
            return angular.isUndefined(str) || str.length == 0;
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

        $scope.addTags = function() {
            $scope.tagMsg = "";

            // Validation
            if (isUndefinedOrEmpty($scope.indexId) ||
                isUndefinedOrEmpty($scope.typeId) ||
                isUndefinedOrEmpty($scope.documentId) ||
                isUndefinedOrEmpty($scope.tag)) {
                $scope.tagMsg = "A required field is empty";
                return;
            }

            var url = "";
            // TODO: Once elasticsearch is completely setup we probably don't need all these inputs
            url = "/proxy?url=" + discover.searchHost + "/" + $scope.indexId + "/" + $scope.typeId + "/" + $scope.documentId;
            $http({
                method: "GET",
                url: url
            }).then(function successCallback( html ) {
                $scope.document = html.data._source;
                var returnObj = {};
                if (angular.isUndefined($scope.document.keywords)) {
                    returnObj = {
                        "doc": {
                            "keywords": [$scope.tag]
                        }
                    };
                } else {
                    var tags = $scope.document.keywords;
                    tags.push($scope.tag);
                    returnObj = {
                        "doc": {
                            "keywords": tags
                        }
                    };
                }

                $http.post(
                    url + "/_update",
                    returnObj,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                ).then(function successCallback(res) {
                    $scope.tagMsg = "Keyword added successfully";
                    console.log("Success!");
                }, function errorCallback(res) {
                    console.log("search.controller tag fail: " + res.status);
                    toaster.pop('error', "Error", "There was an issue with your tag request.");
                });


            }, function errorCallback(response){
                console.log("search.controller search fail");
                toaster.pop('error', "Error", "There was an issue with your search request.");
            });

        };

        $scope.getFirstIndex = function () {
            return ($scope.pagination.current * $scope.size) + 1;
        };

        $scope.getLastIndex = function() {
            var endingPoint = ($scope.pagination.current * $scope.size) + $scope.size;
            if (endingPoint > $scope.totalResults) {
                endingPoint = $scope.totalResults;
            }
            return endingPoint;
        };
    }
})();
