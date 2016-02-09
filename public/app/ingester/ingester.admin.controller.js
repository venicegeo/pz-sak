/**
 * Created by jmcmahon on 1/26/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('IngesterAdminController', ['$scope', '$http', '$log', '$q', 'toaster',  IngesterAdminController]);

    function IngesterAdminController ($scope, $http, $log, $q, toaster) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-ingester"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/admin",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("ingester.admin.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.")
                    //$scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };

        $scope.getUptime = function(dateString) {
            return moment.utc(dateString).fromNow();
        };

        $scope.reset = function() {

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-ingester"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/admin/reset",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("ingester.admin.controller fail");
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

            });

        };

    }

})();