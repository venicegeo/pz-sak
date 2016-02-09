(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('UuidController', ['$scope', '$http', '$log', '$q',  'toaster', UuidController]);

        function UuidController ($scope, $http, $log, $q, toaster) {

                $scope.getUUIDs = function () {
                    $scope.uuids = "";
                    $scope.errorMsg = "";
                    var url = '/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-uuidgen';
                    var posturl = '';
                    $http({
                        method: "GET",
                        url: url
                    }).then(function(result) {
                       if ($scope.uuidCount === undefined){
                           posturl = "/proxy?url="+result.data.host +"/v1/uuids"
                        }
                        else {
                           posturl = "/proxy?url="+result.data.host + "/v1/uuids?count="+$scope.uuidCount;
                        }

                        console.log(posturl);
                        $http({
                            method: "POST",
                            url: posturl,
                        }).then(function successCallback( html ) {
                            $scope.uuids = html.data.data;
                            /*angular.forEach($scope.logs, function(item){
                             console.log(item);
                             })*/
                        }, function errorCallback(response){
                            console.log("fail");
                            toaster.pop('error', "Error", "There was an issue retrieving UUID(s)");
                            //$scope.errorMsg = "There was an issue with your request.  Please make sure ..."
                        });

                    });

                };



        }




})();