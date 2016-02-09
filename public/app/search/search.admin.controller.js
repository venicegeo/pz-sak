/**
 * Created by jmcmahon on 1/29/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('SearchAdminController', ['$scope', '$http', '$log', '$q', 'toaster',  SearchAdminController]);

    function SearchAdminController ($scope, $http, $log, $q, toaster) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/elasticsearch"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/_cluster/health",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                }, function errorCallback(response){
                    console.log("Search.admin.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

            });

        };

    }

})();
