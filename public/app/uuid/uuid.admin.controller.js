/**
 * Created by jmcmahon on 1/22/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('UuidAdminController', ['$scope', '$http', '$log', '$q',  UuidAdminController]);

    function UuidAdminController ($scope, $http, $log, $q) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-uuidgen"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "http://" + result.data.host + "/v1/admin/stats",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                    console.log($scope.adminData);
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };


        $scope.getUptime = function(dateString) {
            return moment.utc(dateString).fromNow();
        };

        $scope.reset = function() {
            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-uuidgen"
            }).then(function(result) {


                $http({
                    method: "POST",
                    url: "http://" + result.data.host + "/v1/admin/shutdown?reason=AdminUtil",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });
        };

    }

})();