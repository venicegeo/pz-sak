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
        .controller('WorkflowController', ['$scope', '$http', '$log', '$q',  'toaster', WorkflowController]);

    function WorkflowController ($scope, $http, $log, $q, toaster) {

        $scope.showNewEventTypeForm = false;
        $scope.showEventTypeTable = false;
        $scope.showEventTable = false;

        $scope.updateTypeTable = function (eventTypeId) {

            if (!$scope.showEventTypeTable){
                $scope.showEventTypeTable = true;
            }
            else{
                $scope.showeventTypeTable = false;
            }

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/eventtypes?id="+eventTypeId,
                }).then(function successCallback( html ) {
                    //TODO: When the get eventtypes by ID is fixed in services, change the following to take out the [0] array call.
                    $scope.eventTypeId = html.data[0].id;
                    $scope.eventTypeName = html.data[0].name;
                    $scope.eventTypeItemId = html.data[0].mapping.code;
                    $scope.eventTypeSeverity = html.data[0].mapping.severity;
                    $scope.eventTypeProblem = html.data[0].mapping.filename;
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
                });

            });

};
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
                // Only return non-null values in the array
                $scope.events = html.data.filter(function(n) { return n != undefined });
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the events.");
            });

        });

    };

        $scope.showHideNewEventType = function() {
            $scope.showNewEventTypeForm = !$scope.showNewEventTypeForm;
        };

        $scope.showHideEventTypeTable = function() {
            $scope.showEventTypeTable = !$scope.showEventTypeTable;
        };

        $scope.cancelCreateEventType = function() {
            $scope.showNewEventTypeForm = !$scope.showNewEventTypeForm;
        };

        $scope.showHideEventTable = function() {
            $scope.showEventTable = !$scope.showEventTable;
        };

        $scope.showHideNewEventForm = function() {
            $scope.showNewEventForm = !$scope.showNewEventForm;
        };

        $scope.cancelCreateEvent = function() {
            $scope.showNewEventForm = !$scope.showNewEventForm;
        };

        $scope.loadEventsPage = function() {

            //Load event Types drop down with values from service
            $scope.getEventTypes();


        };

        $scope.getEventTypes = function () {
            $scope.eventType = "";
            $scope.eventTypes = [];

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/eventtypes",
                }).then(function successCallback( html ) {
                    $scope.eventTypes = html.data;
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
                });

            });

        };

        $scope.createEventType = function(newEventType) {

            var eventDataObj = {
                name: $scope.newEventTypeName,
                mapping: {
                    itemId:$scope.newEventTypeItemId,
                    severity: $scope.newEventTypeSeverity,
                    problem: $scope.newEventTypeProblem,
                }
            };
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {
                $http.post(
                    "/proxy?url=" + result.data.host + "/v1/eventtypes",
                    eventDataObj
                ).then(function successCallback(res) {
                    $scope.message = res;

                    //reload events table
                    $scope.getEventTypes();

                    //clear input values
                    $scope.newEventTypeName = null;
                    $scope.newEventTypeItemId = null;
                    $scope.newEventTypeSeverity = null;
                    $scope.newEventTypeProblem = null;

                    //hide create new eventtype table:
                    $scope.showHideNewEventType();

                    toaster.pop('success', "Success", "The event was successfully posted.")

                }, function errorCallback(res) {
                    console.log("workflow.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem submitting the event message.");
                });
            })
        };

        $scope.selectEventType = function(newEventType) {
            //User selected to create an event associated with an event type

            //TODO: Show/hide new event table
            $scope.showHideNewEventForm();
            $scope.newEventType = newEventType;

            //TODO: On submit, hide the event type table and have toaster pop open showing success.
        };

        $scope.deleteEventType = function(eventTypeId) {
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {
                $http({
                    method: "DELETE",
                    url: "/proxy?url=" + result.data.host + "/v1/eventtypes/"+eventTypeId,
                }).then(function successCallback( html ) {
                    $scope.message = html;
                    console.log("success");

                    $scope.eventTypeId = "";
                    $scope.eventTypeName = "";
                    $scope.eventTypeItemId = "";
                    $scope.eventTypeSeverity = "";
                    $scope.eventTypeProblem = "";
                    $scope.getEventTypes();

                    toaster.pop('success', "Success", "The eventtype was successfully deleted.");
                }, function errorCallback(response) {
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was a problem deleting the eventtype.");
                });
            });
        };

    $scope.postEvent = function(){
        $scope.errorMsg = "";

        var currentTime = moment().utc().toISOString();
        var alertMessage = $scope.alertMessage;
        var dataObj = {
            type: $scope.newEventType,
            date: currentTime,
            data:{
                itemId: $scope.newEventItemId,
                severity: $scope.newEventSeverity,
                problem: $scope.newEventProblem
                 }
        };
        $http({
            method: "GET",
            url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
        }).then(function(result) {
            $http.post(
                "/proxy?url=" + result.data.host + "/v1/events/",
                dataObj
            ).then(function successCallback(res) {
                $scope.message = res;

                //reload events table
                $scope.getEvents();

                //clear input values
                $scope.alertMessage = null;
                $scope.eventType = null;
                toaster.pop('success', "Success", "The event was successfully posted.")

            }, function errorCallback(res) {
                console.log("workflow.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the event message.");
            });
        })
    };

        $scope.deleteEvent = function(eventId) {
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {
                $http({
                    method: "DELETE",
                    url: "/proxy?url=" + result.data.host + "/v1/events/"+eventId,
                }).then(function successCallback( html ) {
                    $scope.message = html;
                    console.log("success");

                    //reload events table
                    $scope.getEvents();

                    //clear input values
                    $scope.alertMessage = null;
                    $scope.eventType = null;

                    toaster.pop('success', "Success", "The event was successfully deleted.");
                }, function errorCallback(response) {
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was a problem deleting the event.");
                });
            });
        };

        $scope.getAlerts = function () {
            $scope.alerts = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/alerts",
                }).then(function successCallback( html ) {
                    // Only return non-null values in the array
                    $scope.alerts = html.data.filter(function(n) { return n != undefined });
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the alerts.");
                });

            });

        };

        $scope.postAlert = function(){
            $scope.errorMsg = "";
            var alertTrigger = $scope.alertTrigger;
            var alertEvent = $scope.alertEvent;
            var dataObj = {
                trigger_id: alertTrigger,
                event_id: alertEvent
            };
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {
                $http.post(
                    "/proxy?url=" + result.data.host + "/v1/alerts",
                    dataObj
                ).then(function successCallback(res) {
                    $scope.message = res;

                    //reload alerts table
                    $scope.getAlerts();

                    //set inputs to null to clear
                    $scope.alertTrigger = null;
                    $scope.alertEvent = null;
                    toaster.pop('success', "Success", "The alert was successfully posted.")

                }, function errorCallback(res) {
                    console.log("workflow.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem submitting the alert message.");
                });
            })
        };

        $scope.deleteAlert = function(alertId) {
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {
                $http({
                    method: "DELETE",
                    url: "/proxy?url=" + result.data.host + "/v1/alerts/"+alertId,
                }).then(function successCallback( html ) {
                    $scope.message = html;
                    console.log("success");

                    //getAlerts again to reload table
                    $scope.getAlerts();

                    //Set input to null to clear
                    $scope.alertTrigger = null;
                    $scope.alertEvent = null;

                    toaster.pop('success', "Success", "The alert was successfully deleted.");
                }, function errorCallback(response) {
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was a problem deleting the alert message.");
                });
            });
        };



        $scope.getTriggers = function () {
            $scope.triggers = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/v1/triggers",
                }).then(function successCallback( html ) {
                    $scope.triggers = html.data;
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the triggers.");
                });

            });

        };

        $scope.postTrigger = function(){
            $scope.errorMsg = "";

            var currentTime = moment().utc().toISOString();
            //var triggerMessage = $scope.triggerMessage;
            var dataObj = {
                title: $scope.triggerTitle,
                condition:{
                    query: $scope.triggerQuery,
                    type: $scope.triggerType,
                },
                job: {
                    task: $scope.triggerTask
                }
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

                    //reload table
                    $scope.getTriggers();

                    //set input fields to null to clear
                    //$scope.triggerMessage = null;
                    $scope.triggerTitle = null;
                    $scope.triggerQuery = null;
                    $scope.triggerType = null;
                    $scope.triggerTask = null;
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
                    url: "/proxy?url=" + result.data.host + "/v1/triggers/"+triggerId,
                }).then(function successCallback( html ) {
                    $scope.trigger = html.data;
                }, function errorCallback(response){
                    console.log("workflow.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with retrieving the trigger.");
                });

            });

        };

        $scope.deleteTrigger = function(triggerId){
            $scope.errorMsg = "";
            var workflowMessage = $scope.workflowMessage;

            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-workflow"
            }).then(function(result) {


                $http.delete(
                    "/proxy?url=" + result.data.host + "/v1/triggers/"+triggerId
                    ).then(function successCallback(res) {
                    $scope.message = res;
                    $scope.getTriggers();
                    $scope.workflowMessage = null;
                    toaster.pop('success', "Success", "The trigger was successfully deleted.")

                }, function errorCallback(res) {
                    console.log("workflow.controller fail"+res.status);

                    toaster.pop('error', "Error", "There was a problem deleting the trigger.");
                });
            })
        };


}

})();