/**
 Copyright 2016, RadiantBlue Technologies, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('UuidController', ['$scope', '$http', '$log', '$q',  'toaster', 'discover', UuidController]);

        function UuidController ($scope, $http, $log, $q, toaster, discover) {

                $scope.getUUIDs = function () {
                    $scope.uuids = "";
                    $scope.errorMsg = "";
                        var url = discover.uuidHost;
                        var posturl = '';
                        if ($scope.uuidCount === undefined){
                            posturl = "/proxy?url="+ url +"/v1/uuids"
                        }
                        else {
                            posturl = "/proxy?url="+ url + "/v1/uuids?count="+$scope.uuidCount;
                        }

                        console.log(posturl);
                        $http({
                            method: "POST",
                            url: posturl,
                        }).then(function successCallback( html ) {
                            $scope.uuids = html.data.data;
                        }, function errorCallback(response){
                            console.log("fail");
                            toaster.pop('error', "Error", "There was an issue retrieving UUID(s)");
                        });


                };



        }




})();