(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('LoggerController', ['$scope', '$http', '$log', '$q',  LoggerController]);

    function LoggerController ($scope, $http, $log, $q) {

        $scope.getLogs = function () {
            $scope.logs = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=http://" + result.data.host + "/v1/messages",
                }).then(function successCallback( html ) {
                    $scope.logs = html.data;
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };

        $scope.postLog = function(){
            $scope.errorMsg = "";

            var currentTime = moment().utc().toISOString();
            var logMessage = $scope.logMessage;
            var dataObj = {
                service: "log-tester",
                address: "128.1.2.3",
                time: currentTime,
                severity: "Info",
                message: logMessage
            }
            $http({
                method: "GET",
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {


                $http.post(
                    "/proxy?url=http://" + result.data.host + "/v1/messages",
                    dataObj
                ).then(function successCallback(res) {
                    $scope.message = res;
                    $scope.getLogs();
                    $scope.logMessage = null;

                    console.log("Success!");
                }, function errorCallback(res) {
                    console.log("fail");
                    $scope.successMsg = "There was a problem submitting the Log Message."
                    $scope.errorMsg = "Failure message: " + JSON.stringify({data: data});
                });
            })
        }
    }

})();