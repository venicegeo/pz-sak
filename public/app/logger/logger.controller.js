(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('LoggerController', ['$scope', '$http', '$log', '$q',  'toaster', LoggerController]);

    function LoggerController ($scope, $http, $log, $q, toaster) {

        $scope.getLogs = function () {
            $scope.logs = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "http://"+result.data.host +"/v1/messages",
                }).then(function successCallback( html ) {
                    $scope.logs = html.data;
                    /*angular.forEach($scope.logs, function(item){
                     console.log(item);
                     })*/
                }, function errorCallback(response){
                    console.log("logger.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the logs.");
                });

            });

        };

        $scope.postLog = function(){
            $scope.errorMsg = "";

            //var url = 'http://pz-logger.cf.piazzageo.io/log';
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
                url: "http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-logger"
            }).then(function(result) {


                $http.post(
                    "http://"+result.data.host +"/v1/messages",
                    dataObj,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                ).then(function successCallback(res) {
                    $scope.message = res;
                    $scope.getLogs();
                    $scope.logMessage = null;
                    toaster.pop('success', "Success", "The log was successfully posted.")

                    //console.log("Success!");
                }, function errorCallback(res) {
                    console.log("logger.controller fail"+res.status);
                    //$scope.successMsg = "There was a problem submitting the Log Message."
                   toaster.pop('error', "Error", "There was a problem submitting the log message.");
                });
            })
        }
    }

})();