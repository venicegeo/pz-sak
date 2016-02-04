/**
 * Created by jmcmahon on 1/22/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('UuidAdminController', ['$scope', '$http', '$log', '$q','toaster',  UuidAdminController]);

    function UuidAdminController ($scope, $http, $log, $q, toaster) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-uuidgen"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "http://" + result.data.host + "/v1/admin/stats",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                    console.log($scope.adminData);
                    //toaster.pop('success', "Success", "logs successfully retrieved.")
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("fail");
                    toaster.pop('error', "Error", "There was a problem retrieving the admin data.")

                });

            });

        };


        $scope.getUptime = function(dateString) {
            return moment.utc(dateString).fromNow();
        };

        $scope.reset = function() {
            $http({
                method: "GET",
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-uuidgen"
            }).then(function(result) {
                var data = {
                    reason: $scope.shutdownReason
                };

                $http({
                    method: "POST",
                    url: "/proxy?url=http://" + result.data.host + "/v1/admin/shutdown",
                    data: data
                }).then(function successCallback( html ) {
                    $scope.shutdownResponse = html.data;
                }, function errorCallback(response){
                    // 502 means the service was killed
                    if (response.status == "502") {
                        toaster.pop('success', "Success", "Service successfully shutdown");
                    }
                    else {
                        toaster.pop('error', "Error", "There was a problem with the shutdown.  Please try again later.")
                    }

                });

            });
        };

    }

})();