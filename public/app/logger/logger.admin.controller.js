/**
 * Created by jmcmahon on 1/22/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('LoggerAdminController', ['$scope', '$http', '$log', '$q', 'toaster',  LoggerAdminController]);

    function LoggerAdminController ($scope, $http, $log, $q, toaster) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "http://" + result.data.host + "/v1/admin/stats",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("fail");
                    toaster.pop('error', "Error", "There was an error retrieving the admin data");
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
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {

                var data = {
                    reason: $scope.shutdownReason
                };
                $http({
                    method: "POST",
                    url: "http://" + result.data.host + "/v1/admin/shutdown",
                    data: data
                }).then(function successCallback( html ) {
                    $scope.shutdownResponse = html.data;
                }, function errorCallback(response) {
                    // 502 means the service was killed
                    if (response.status == "502") {
                        toaster.pop('success', "Success", "Service successfully shutdown");
                    }

                    //$scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };

    }

})();