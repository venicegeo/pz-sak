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
        .controller('UserServiceRegistryAdminController', ['$scope', '$http', 'toaster', 'discover', UserServiceRegistryAdminController]);

    function UserServiceRegistryAdminController ($scope, $http, toaster, discover) {

        $scope.getStatus = function () {
            $scope.adminData = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.serviceControllerHost + "/metrics",
            }).then(function successCallback( html ) {
                $scope.classes = html.data["classes"];
                $scope.classesLoaded = html.data["classes.loaded"];
                $scope.classesUnloaded = html.data["classes.unloaded"];
                $scope.twoStatusCounterLower = html.data["counter.status.200.jumpstart.string.toLower"];
                $scope.twoStatusCounterMetrics = html.data["counter.status.200.metrics"];
                $scope.twoStatusCounterDelete = html.data["counter.status.200.servicecontroller.deleteService"];
                $scope.twoStatusCounterDescribe = html.data["counter.status.200.servicecontroller.describeService"];
                $scope.twoStatusCounterExecute = html.data["counter.status.200.servicecontroller.executeService"];
                $scope.twoStatusCounterList = html.data["counter.status.200.servicecontroller.listService"];
                $scope.twoStatusCounterRegister = html.data["counter.status.200.servicecontroller.registerService"];
                $scope.twoStatusCounterUpdate = html.data["counter.status.200.servicecontroller.updateService"];
                $scope.gaugeStatusCounterLower = html.data["gauge.response.jumpstart.string.toLower"];
                $scope.gaugeStatusCounterMetrics = html.data["gauge.response.metrics"];
                $scope.gaugeStatusCounterDelete = html.data["gauge.response.servicecontroller.deleteService"];
                $scope.gaugeStatusCounterDescribe = html.data["gauge.response.servicecontroller.describeService"];
                $scope.gaugeStatusCounterExecute = html.data["gauge.response.servicecontroller.executeService"];
                $scope.gaugeStatusCounterList = html.data["gauge.response.servicecontroller.listService"];
                $scope.gaugeStatusCounterRegister = html.data["gauge.response.servicecontroller.registerService"];
                $scope.gaugeStatusCounterUpdate = html.data["gauge.response.servicecontroller.updateService"];
                $scope.marksweepCount = html.data["gc.ps_marksweep.count"];
                $scope.marksweepTime = html.data["gc.ps_marksweep.time"];
                $scope.scavengeCount = html.data["gc.ps_scavenge.count"];
                $scope.scavengeTime = html.data["gc.ps_scavenge.time"];
                $scope.heap = html.data["heap"];
                $scope.heapCommitted = html.data["heap.committed"];
                $scope.heapInit = html.data["heap.init"];
                $scope.heapUsed = html.data["heap.used"];
                $scope.httpsessionsActive = html.data["httpsessions.active"];
                $scope.httpsessionsMax = html.data["httpsessions.max"];
                $scope.instanceUptime = html.data["instance.uptime"];
                $scope.mem = html.data["mem"];
                $scope.memFree = html.data["mem.free"];
                $scope.processors = html.data["processors"];
                $scope.systemloadAverage = html.data["systemload.average"];
                $scope.threads = html.data["threads"];
                $scope.threadsDaemon = html.data["threads.daemon"];
                $scope.threadsPeak = html.data["threads.peak"];
                $scope.threadsTotalStarted = html.data["threads.totalStarted"];
                $scope.uptime = html.data["uptime"];

            }, function errorCallback(response){
                console.log("admin status failure");
                toaster.pop('error', "Error", "There was an error retrieving the admin data");
            });


        };

        $scope.getUptime = function(dateString) {
            return moment.utc(dateString).fromNow();
        };

    }

})();