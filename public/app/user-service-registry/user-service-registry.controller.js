/**
 * Created by jmcmahon on 1/27/2016.
 */

(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('UserServiceController', ['$scope', '$http', '$log', '$q', UserServiceController]);


    function UserServiceController($scope, $http, $log, $q) {
        $scope.method = 'GET';
        $scope.responseType = 'application/json';

        $scope.registerService = function() {
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-servicecontroller"
            }).then(function(result) {

                // Handle spaces or no spaces between
                var params = [""];
                if (!angular.isUndefined($scope.params) && $scope.params !== "") {
                    params = $scope.params.split(", ");
                    if (params.length == 1) {
                        params = params[0].split(",");
                    }
                }
                var data = {
                    "name":$scope.serviceName,
                    "description":$scope.serviceDescription,
                    "url":$scope.serviceUrl,
                    "method":$scope.method,
                    "params":params,
                    "responseMimeType":$scope.responseType
                };
                $http.post(
                    "http://" + result.data.address + "/servicecontroller/registerService",
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(function successCallback( html ) {
                    $scope.resourceId = html.data.resourceId;
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.serviceMsg = "There was an issue with your request."
                });

            });
        };

        $scope.executeService = function() {
            $scope.executeMsg = "";
            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-servicecontroller"
            }).then(function(result) {

                if (angular.isUndefined($scope.dataInput)) {
                    $scope.dataInput = "";
                }
                var dataInputsObj = {};
                if (!angular.isUndefined($scope.dataInputs) && $scope.dataInputs !== "") {
                    dataInputsObj = JSON.parse($scope.dataInputs);
                }
                var data = {
                    "resourceId":$scope.resource,
                    "dataInput":$scope.dataInput,
                    "dataInputs":dataInputsObj
                };
                $http.post(
                    "http://" + result.data.address + "/servicecontroller/executeService",
                    data,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(function successCallback( html ) {
                    $scope.serviceResponse = html.data;
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.executeMsg = "There was an issue with your request."
                });

            });

        };

    }
})();
