(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('UuidController', ['$scope', '$http', '$log', '$q',  UuidController]);

        function UuidController ($scope, $http, $log, $q) {



                $scope.getUUIDs = function () {
                    $scope.uuids = "";
                    $scope.errorMsg = "";
                    var url = 'http://pz-uuidgen.cf.piazzageo.io/uuid';
                    if ($scope.uuidCount === undefined){
                        url = url;
                    }
                    else {
                        url += "?count="+$scope.uuidCount;
                    }

                    var request = $http({
                        method: "post",
                        url: url

                    });

                    request.success(
                        function( html ) {
                            $scope.uuids = html.data;
                            angular.forEach($scope.uuid, function(item){
                                console.log(item);
                            })
                        }
                    )
                    request.error(function(){
                        console.log("fail");
                        $scope.errorMsg = "There was an issue with your request.  Please make sure your request contains only numeric values between 0-255."
                    });







                };

        }




})();