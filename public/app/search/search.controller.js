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
        .controller('SearchController', ['$scope', '$http', 'toaster', 'discover', 'gateway', SearchController]);


    function SearchController($scope, $http, toaster, discover, gateway) {
        $scope.size = 100;
        $scope.from = 0;

        $scope.pageOptions = [10, 50, 100];

        $scope.$watch("size", function(newValue, oldValue) {
            $scope.from = 0;
            if (angular.isDefined($scope.searchTerm)) {
                $scope.getSearchResults();
            }
            $scope.searchTerm = "";
        });

        $scope.getResultsCount = function(query) {
            $http({
                method: "POST",
                url: "/proxy/" + discover.searchHost + "/api/v1/recordcount",
                data: query
            }).then(function successCallback( html ) {
                $scope.totalResults = html.data;
                if ($scope.totalResults == 0) {
                    $scope.errorMsg = "No results to display";
                }
            }, function errorCallback(response){
                console.log("search.controller results count fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with your request.");
            });
        };

        $scope.getSearchResults = function($event) {
            console.log($event);
            $scope.errorMsg = "";
            $scope.tagMsg = "";
            if (!angular.isUndefined($event)) {
                // Reset to first page if new search
                $scope.from = 0;
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
                "from": $scope.from
            };

            $scope.getResultsCount(q);

            gateway.async(
                "POST",
                "/data/query",
                data
            ).then(function successCallback( html ) {
                $scope.searchResults = html.data.data;
            }, function errorCallback(response){
                console.log("search.controller get search results fail: " + response.status);
                toaster.pop('error', "Error", "There was an issue with your search request.");
            });

        };

        var isUndefinedOrEmpty = function(str) {
            return angular.isUndefined(str) || str.lengh == 0;
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

        $scope.nextPage = function() {
            if ($scope.from < $scope.totalResults-$scope.size) {
                $scope.from += $scope.size;
                $scope.getSearchResults();
                $('html, body').scrollTop(0);
                // $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        };

        $scope.prevPage = function() {
            if ($scope.from > 0) {
                $scope.from -= $scope.size;
                $scope.getSearchResults();
                $('html, body').scrollTop(0);
                // $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        };

        $scope.getLastIndex = function() {
            var endingPoint = $scope.from + $scope.size;
            if (endingPoint > $scope.totalResults) {
                endingPoint = $scope.totalResults;
            }
            return endingPoint;
        };
    }
})();
