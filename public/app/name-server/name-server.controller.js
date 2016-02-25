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
        .controller('NameServerController', ['$scope', '$http', '$log', '$q', 'toaster',  NameServerController]);

    function NameServerController ($scope, $http, $log, $q, toaster) {

        $scope.getServices = function (){

            var url = '/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources';
            var request = $http({
                method: "GET",
                url: url

            });
            request.success(
                function( html ) {

                    $scope.loggerHost = html["pz-logger"].host;
                    $scope.loggerType = html["pz-logger"].type;
                    $scope.loggerPort = html["pz-logger"].port;
                    $scope.uuidHost = html["pz-uuidgen"].host;
                    $scope.uuidType = html["pz-uuidgen"].type;
                    $scope.uuidPort = html["pz-uuidgen"].port;
                    $scope.workflowHost = html["pz-workflow"].host;
                    $scope.workflowType = html["pz-workflow"].type;
                    $scope.workflowPort = html["pz-workflow"].port;
                    $scope.kafkaHost = html["kafka"].host;
                    $scope.kafkaType = html["kafka"].type;
                    $scope.kafkaPort = html["kafka"].port;
                    $scope.zookeeperHost = html["zookeeper"].host;
                    $scope.zookeeperType = html["zookeeper"].type;
                    $scope.zookeeperPort = html["zookeeper"].port;
                    $scope.searchHost = html["elasticsearch"].host;
                    $scope.searchType = html["elasticsearch"].type;
                    $scope.searchPort = html["elasticsearch"].port;
                    //$scope.ingestHost = html["pzIngester"].host;
                    //$scope.ingestType = html["pzIngester"].type;
                    //$scope.ingestPort = html["pzIngester"].port;
                    $scope.serviceControllerHost = html["pz-servicecontroller"].address;
                    $scope.serviceControllerType = html["pz-servicecontroller"].type;
                    $scope.serviceControllerPort = html["pz-servicecontroller"].port;
                    $scope.dispatcherHost = html["pz-dispatcher"].host;
                    $scope.dispatcherType = html["pz-dispatcher"].type;
                    $scope.dispatcherPort = html["pz-dispatcher"].port;
                    $scope.gatewayHost = html["pz-gateway"].host;
                    $scope.gatewayType = html["pz-gateway"].type;
                    $scope.gatewayPort = html["pz-gateway"].port;
                    $scope.jobManagerHost = "pz-jobmanager.cf.piazzageo.io";//html["pz-jobmanager"].host;
                    $scope.jobManagerType = "core-service";//html["pz-jobmanager"].type;
                    $scope.jobManagerPort = "";//html["pz-jobmanager"].port;
                }
            )
            request.error(function(){
                console.log("name-server.controller fail");
                toaster.pop('error', "Error", "There was an issue with your request. One or more services not found.");
            });

        };
    }

})();