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
        .controller('WorkflowController', ['$scope', '$http', '$log', '$q',  'toaster', 'discover', WorkflowController]);

    function WorkflowController ($scope, $http, $log, $q, toaster, discover) {

        $scope.selectedTypes = [];
        $scope.addedTypes = [];
        $scope.eventTypeValues = [];
        $scope.showNewEventTypeForm = false;
        $scope.showEventTypeTable = false;
        $scope.showEventTable = false;
        $scope.showEventForm = false;


        $scope.getEvents = function () {
        $scope.events = "";
        $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/events",
            }).then(function successCallback( html ) {
                // Only return non-null values in the array
                if(html.data != null) {
                    $scope.events = html.data.filter(function (n) {
                        return n != undefined
                    });
                }
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the events.");
            });

    };

        $scope.showHideNewEventType = function() {
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
                url: "/proxy?url=" + discover.workflowHost + "/v1/eventtypes",
            }).then(function successCallback( html ) {
                if(html.data != null) {
                    $scope.eventTypes = html.data;
                    $scope.selectedEventTypes = html.data;
                }
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
            });

        };
        $scope.updateTypeTable = function (eventTypeId) {

            if (!$scope.showEventForm){
                $scope.showNewEventForm = true;
            }
            else{
                $scope.showNewEventForm = false;
            }

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/eventtypes/"+eventTypeId,
            }).then(function successCallback( html ) {
                $scope.eventTypeLabel = html.data.name;
                $scope.eventTypeId = html.data.id;
                $scope.eventTypeName = html.data.name;
                $scope.parameters = html.data.mapping;

            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
            });

        };

        $scope.selectEventType = function(newEventType) {
            //User selected to create an event associated with an event type

            //TODO: Show/hide new event table
            $scope.showHideNewEventForm();
            $scope.newEventType = newEventType;

            //TODO: On submit, hide the event type table and have toaster pop open showing success.
        };





    $scope.postEvent = function(params){
        console.log(params);
        var array = $.map(params, function(value, index) {
            return [index];
        });

        var result = {};
        for(var i=0;i<array.length;i++){
            result[array[i]] = $scope.eventTypeValues[i];
        }
        console.log(result);

        $scope.errorMsg = "";

        var currentTime = moment().utc().toISOString();
        var alertMessage = $scope.alertMessage;
        var dataObj = {
            eventtype_id: $scope.eventType.id,
            date: currentTime,
            data: result
        };

        console.log(dataObj);

        $http.post(
            "/proxy?url=" + discover.workflowHost + "/v1/events/" + $scope.eventTypeName,
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
    };

        $scope.deleteEvent = function(eventtypeId, eventId) {
            //delete endpoint deletes based on event type NAME and eventID.
            //first call the get on eventtypes by ID to store the eventTypeName, then pass that eventTypeName into
            //the delele endpoint along with the eventId

            var url = "";
            var deleteEvent = "";
            url = "/proxy?url=" + discover.workflowHost + "/v1/eventtypes/"+eventtypeId;
            $http({
                method: "GET",
                url: url
            }).then(function successCallback( html ) {
                deleteEvent = html.data.name;

                $http({
                    method: "DELETE",
                    url: "/proxy?url=" + discover.workflowHost + "/v1/events/" + deleteEvent + "/" + eventId,
                }).then(function successCallback(html) {
                    $scope.message = html;
                    console.log("success");

                    //reload events table
                    $scope.getEvents();

                    //clear input values
                    $scope.alertMessage = null;
                    $scope.eventType = null;

                    toaster.pop('success', "Success", "The event was successfully deleted.");
                }, function errorCallback(response) {
                    console.log("workflow.controller fail" + response.status);
                    toaster.pop('error', "Error", "There was a problem deleting the event.");
                });
            });
            };


        $scope.getAlerts = function () {
            $scope.alerts = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/alerts",
            }).then(function successCallback( html ) {
                // Only return non-null values in the array
                if(html.data!= null) {
                    $scope.alerts = html.data.filter(function (n) {
                        return n != undefined
                    });
                }

            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the alerts.");
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

            $http.post(
                "/proxy?url=" + discover.workflowHost + "/v1/alerts",
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
        };

        $scope.deleteAlert = function(alertId) {
            $http({
                method: "DELETE",
                url: "/proxy?url=" + discover.workflowHost + "/v1/alerts/"+alertId,
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
        };



        $scope.getTriggers = function () {
            $scope.triggers = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/triggers",
            }).then(function successCallback( html ) {
                $scope.triggers = html.data;
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the triggers.");
            });

        };

        $scope.postTrigger = function(){
            $scope.errorMsg = "";
            var eventTriggerType = [];

            for(var i=0;i<$scope.selectedEventTypes.length;i++){
                eventTriggerType[i] = $scope.selectedEventTypes[i].id;
            }
            console.log(eventTriggerType);

            var currentTime = moment().utc().toISOString();
            var dataObj = {

                title: $scope.triggerTitle,
                condition:{
                    query: angular.fromJson($scope.triggerQuery),
                    eventtype_ids: eventTriggerType,
                },
                job: {
                    task: JSON.parse($scope.triggerJob)
                },
            };

            $http.post(
                "/proxy?url=" + discover.workflowHost + "/v1/triggers",
                dataObj
            ).then(function successCallback(res) {
                $scope.message = res;

                //reload table
                $scope.getTriggers();

                //set input fields to null to clear
                //$scope.triggerMessage = null;
                $scope.triggerTitle = null;
                $scope.triggerQuery = null;
                $scope.selectedEventTypes = null;
                $scope.triggerJob = null;
                toaster.pop('success', "Success", "The trigger was successfully posted.")

            }, function errorCallback(res) {
                console.log("workflow.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the trigger message.");
            });
        };

        $scope.getTriggerById = function () {
            $scope.triggerById = "";
            $scope.triggerId = "";
            $scope.errorMsg = "";

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/triggers/"+triggerId,
            }).then(function successCallback( html ) {
                $scope.trigger = html.data;
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the trigger.");
            });

        };

        $scope.deleteTrigger = function(triggerId){
            $scope.errorMsg = "";
            var workflowMessage = $scope.workflowMessage;

            $http.delete(
                "/proxy?url=" + discover.workflowHost + "/v1/triggers/"+triggerId
                ).then(function successCallback(res) {
                $scope.message = res;
                $scope.getTriggers();
                $scope.workflowMessage = null;
                toaster.pop('success', "Success", "The trigger was successfully deleted.")

            }, function errorCallback(res) {
                console.log("workflow.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem deleting the trigger.");
            });
        };


}

})();