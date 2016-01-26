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
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "http://" + result.data.address,
                }).then(function successCallback( html ) {
                    $scope.logs = html.data;
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                });

            });

        };

        $scope.postLog = function(){
            $scope.errorMsg = "";
            var url = 'http://pz-logger.cf.piazzageo.io/log';
            var currentTime = moment().utc().toISOString();
            var logMessage = $scope.logMessage;
            var dataObj = {
                service: "log-tester",
                address: "128.1.2.3",
                time: currentTime,
                severity: "Info",
                message: logMessage
            }


            $http.post(
                url,
                dataObj,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers" : "*",
                        "Access-Control-Allow-Methods" : "*",
                        "Access-Control-Allow-Credentials" : "false",
                    }
                }
            ).then(function successCallback(res) {
                $scope.message = res;
                console.log("Success!");
            }, function errorCallback(res) {
                console.log("fail");
                $scope.errorMsg = "Failure message: " + JSON.stringify({data: data});
            });
        }
    }

})();