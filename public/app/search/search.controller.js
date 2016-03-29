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
        .controller('SearchController', ['$scope', '$http', '$log', '$q', 'toaster', 'discover', SearchController]);


    function SearchController($scope, $http, $log, $q, toaster, discover) {
        $scope.size = 10;
        $scope.from = 0;

        $scope.getSearchResults = function($event) {
            console.log($event);
            $scope.errorMsg = "";
            $scope.tagMsg = "";
            if (!angular.isUndefined($event)) {
                // Reset to first page if new search
                $scope.from = 0;
            }

            var params = {
                from: $scope.from,
                size: $scope.size
            };

            if (!angular.isUndefined($scope.searchTerm) && $scope.searchTerm !== "") {
                // TODO: we probably want to set a specific type to query (eg: q=_type:tweet AND trying
                angular.extend(params, {
                    q: $scope.searchTerm,
                });
            }

            $http({
                method: "GET",
                url: "/proxy/" + discover.searchHost + "/_search",
                params: params
            }).then(function successCallback( html ) {
                $scope.searchResults = html.data.hits.hits;
                $scope.totalResults = html.data.hits.total;
                if ($scope.totalResults == 0) {
                    $scope.errorMsg = "No results to display";
                }
            }, function errorCallback(response){
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        var isUndefinedOrEmpty = function(str) {
            var undefinedOrEmpty = false;
            return angular.isUndefined(str) || str.lengh == 0;
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
                    console.log("search.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });


            }, function errorCallback(response){
                console.log("search.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request.");
            });

        };

        $scope.nextPage = function() {
            if ($scope.from < $scope.totalResults-$scope.size) {
                $scope.from += $scope.size;
                $scope.getSearchResults();
                $('html, body').scrollTop(0);
                // $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        }

        $scope.prevPage = function() {
            if ($scope.from > 0) {
                $scope.from -= $scope.size;
                $scope.getSearchResults();
                $('html, body').scrollTop(0);
                // $('html, body').animate({ scrollTop: 0 }, 'fast');
            }
        }

        $scope.getLastIndex = function() {
            var endingPoint = $scope.from + $scope.size;
            if (endingPoint > $scope.totalResults) {
                endingPoint = $scope.totalResults;
            }
            return endingPoint;
        }
    }
})();
