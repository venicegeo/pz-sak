(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('LoggerController', ['$scope', '$http', '$log', '$q',  LoggerController]);

    function LoggerController ($scope, $http, $log, $q) {

        $scope.getLogs = function () {
            $scope.logs = "";
            $scope.errorMsg = "";
            var url = 'http://pz-logger.cf.piazzageo.io/log';

            $http({
                method: "GET",
                url: url,
                responseType: "text",
                transformResponse: function(data, headers) {
                    return data;
                }
            }).then(function successCallback( html ) {
                $scope.logs = html.data;
                /*angular.forEach($scope.log, function(item){
                    console.log(item);
                })*/
            }, function errorCallback(response){
                console.log("fail");
                $scope.errorMsg = "There was an issue with your request.  Please make sure ..."
            });

        };

        $scope.postLog = function(){
            $scope.errorMsg = "";
            var url = 'http://pz-logger.cf.piazzageo.io/log';
            var currentTime = "2007-04-05T14:30Z";
            var logMessage = $scope.logMessage;
            var dataObj = {
                service: "log-tester",
                address: "128.1.2.3",
                time: currentTime,
                severity: "Info",
                message: logMessage
            }


            var res = $http.post(url, dataObj);
            res.success(function(data) {
                $scope.message = data;
                console.log("Success!");
            });
            res.error(function(data) {
                $scope.errorMsg = "Failure message: " + JSON.stringify({data: data});
            });
        }
    }

})();