(function(){
    'use strict';
    angular
        .module('SAKapp')
        .controller('WorkflowController', ['$scope', '$http', '$log', '$q',  'toaster', WorkflowController]);

    function WorkflowController ($scope, $http, $log, $q, toaster) {

        $scope.getEvents = function () {
        $scope.events = "";
        $scope.errorMsg = "";

        $http({
            method: "GET",
            url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
        }).then(function(result) {

            $http({
                method: "GET",
                url: "/proxy?url=" + result.data.host + "/v1/events",
            }).then(function successCallback( html ) {
                $scope.events = html.data;
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the events.");
            });

        });

    };

    $scope.postEvent = function(){
        $scope.errorMsg = "";

        var currentTime = moment().utc().toISOString();
        var alertMessage = $scope.alertMessage;
        var dataObj = {
            type: "string event",
            date: currentTime,
            data: {
                one: "one",
                two: "two",
                three: "three"
            }
        }
        $http({
            method: "GET",
            url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
        }).then(function(result) {


            $http.post(
                "/proxy?url=" + result.data.host + "/v1/events",
                dataObj
            ).then(function successCallback(res) {
                $scope.message = res;
                $scope.getEvents();
                $scope.alertMessage = null;
                toaster.pop('success', "Success", "The alert was successfully posted.")

            }, function errorCallback(res) {
                console.log("workflow.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the alert message.");
            });
        })
    };

        $scope.getTriggers = function () {
            $scope.triggerss = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/triggers",
                }).then(function successCallback( html ) {
                    $scope.conditions = html.data;
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the triggerss.");
                });

            });

        };

        $scope.postTriggers = function(){
            $scope.errorMsg = "";

            var currentTime = moment().utc().toISOString();
            var triggerMessage = $scope.triggerMessage;
            var dataObj = {
                title: "short string",
                description: "long string",
                type: "event type string",
                userid: "just some string for now"
            }
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {


                $http.post(
                    "/proxy?url=" + result.data.host + "/v1/triggers",
                    dataObj
                ).then(function successCallback(res) {
                    $scope.message = res;
                    $scope.getEvents();
                    $scope.alertMessage = null;
                    toaster.pop('success', "Success", "The trigger was successfully posted.")

                }, function errorCallback(res) {
                    console.log("workflow.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem submitting the trigger message.");
                });
            })
        };

        $scope.getTriggerById = function () {
            $scope.triggerById = "";
            $scope.triggerId = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/conditions/:"+triggerId,
                }).then(function successCallback( html ) {
                    $scope.trigger = html.data;
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the trigger.");
                });

            });

        };

        $scope.deleteTriggerById = function(){
            $scope.errorMsg = "";
            $scope.triggerId = "";
            var workflowMessage = $scope.workflowMessage;

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {


                $http.delete(
                    "/proxy?url=" + result.data.host + "/v1/conditions/:id"+triggerId
                    ).then(function successCallback(res) {
                    $scope.message = res;
                    $scope.getTriggers();
                    $scope.workflowMessage = null;
                    toaster.pop('success', "Success", "The trigger was successfully deleted.")

                }, function errorCallback(res) {
                    console.log("workflow.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem deleting the trigger message.");
                });
            })
        };


}

})();