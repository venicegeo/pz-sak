/**
 * Created by jmcmahon on 1/29/2016.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('SearchAdminController', ['$scope', '$http', '$log', '$q',  SearchAdminController]);

    function SearchAdminController ($scope, $http, $log, $q) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/elasticsearch"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "http://" + result.data.host + "/_cluster/health",
                }).then(function successCallback( html ) {
                    $scope.adminData = html.data;
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };

    }

})();
