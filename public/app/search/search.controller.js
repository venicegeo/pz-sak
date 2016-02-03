/**
 * Created by jmcmahon on 1/25/2016.
 */

(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('SearchController', ['$scope', '$http', '$log', '$q', SearchController]);


    function SearchController($scope, $http, $log, $q) {
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

            $http({
                method: "GET",
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/elasticsearch"
            }).then(function(result) {

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
                    url: "/proxy?url=http://" + result.data.host + "/_search",
                    params: params
                }).then(function successCallback( html ) {
                    $scope.searchResults = html.data.hits.hits;
                    $scope.totalResults = html.data.hits.total;
                    if ($scope.totalResults == 0) {
                        $scope.errorMsg = "No results to display";
                    }
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });
        };

        var isUndefinedOrEmpty = function(str) {
            var undefinedOrEmpty = false;
            return angular.isUndefined(str) || str.lengh == 0;
        }

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
            $http({
                method: "GET",
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/elasticsearch"
            }).then(function(result) {
                // TODO: Once elasticsearch is completely setup we probably don't need all these inputs
                url = "/proxy?url=http://" + result.data.host + "/" + $scope.indexId + "/" + $scope.typeId + "/" + $scope.documentId;
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
                        console.log("fail");
                        $scope.tagMsg = "A failure occurred on the server";
                    });


                }, function errorCallback(response){
                    console.log("fail");
                    $scope.tagMsg = "There was an issue with your request.  Please make sure ..."
                });

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
