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
        .controller('WorkflowController', ['$scope', '$http', '$log', '$q',  'toaster', 'discover', 'gateway', WorkflowController]);

    function WorkflowController ($scope, $http, $log, $q, toaster, discover, gateway) {

        $scope.selectedTypes = [];
        $scope.addedTypes = [];
        $scope.eventTypeValues = [];
        $scope.showNewEventTypeForm = false;
        $scope.showEventTypeTable = false;
        $scope.showEventTable = false;
        $scope.showEventForm = false;

        // Pagination
        $scope.pageOptions = [10, 25, 50, 100, 500];

        // Events Pagination
        $scope.totalEvents = 0;
        $scope.eventsPerPage = 10;
        $scope.eventsPagination = {
            current: 0
        };
        $scope.eventsPageChanged = function(newPage) {
            $scope.getEvents(newPage);
        };
        $scope.getEventStart = function () {
            return ($scope.eventsPagination.current * $scope.eventsPerPage) + 1;
        };
        $scope.getEventEnd = function () {
            var end = ($scope.eventsPagination.current * $scope.eventsPerPage) + $scope.eventsPerPage;
            if (end > $scope.totalEvents) {
                return $scope.totalEvents;
            }
            return end;
        };

        // Alerts Pagination
        $scope.totalAlerts = 0;
        $scope.alertsPerPage = 10;
        $scope.alertsPagination = {
            current: 0
        };
        $scope.alertsPageChanged = function(newPage) {
            $scope.getAlerts(newPage);
        };
        $scope.getAlertStart = function () {
            return ($scope.alertsPagination.current * $scope.alertsPerPage) + 1;
        };
        $scope.getAlertEnd = function () {
            var end = ($scope.alertsPagination.current * $scope.alertsPerPage) + $scope.alertsPerPage;
            if (end > $scope.totalAlerts) {
                return $scope.totalAlerts;
            }
            return end;
        };

        // Triggers Pagination
        $scope.totalTriggers = 0;
        $scope.triggersPerPage = 10;
        $scope.triggersPagination = {
            current: 0
        };
        $scope.triggersPageChanged = function(newPage) {
            $scope.getTriggers(newPage);
        };
        $scope.getTriggerStart = function () {
            return ($scope.triggersPagination.current * $scope.triggersPerPage) + 1;
        };
        $scope.getTriggerEnd = function () {
            var end = ($scope.triggersPagination.current * $scope.triggersPerPage) + $scope.triggersPerPage;
            if (end > $scope.totalTriggers) {
                return $scope.totalTriggers;
            }
            return end;
        };


        $scope.getEvents = function (pageNumber) {
            $scope.events = "";
            $scope.errorMsg = "";

            if (pageNumber) {
                $scope.eventsPagination.current = pageNumber - 1;
            }

            var params = {
                page: $scope.eventsPagination.current,
                per_page: $scope.eventsPerPage
            };

            gateway.async(
                "GET",
                "/event",
                null,
                params
            ).then(function successCallback( html ) {
                if (html.data != null) {
                    $scope.events = html.data.data
                    $scope.totalEvents = html.data.pagination.count;
                }
            }, function errorCallback(response){
                console.log("workflow.controller get events fail: "+response.status);
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

            gateway.async(
                "GET",
                "/eventType"
            ).then(function successCallback( html ) {
                if(html.data != null) {
                    $scope.eventTypes = html.data.data;
                    $scope.selectedEventTypes = html.data.data;
                }
            }, function errorCallback(response){
                console.log("workflow.controller get eventtypes fail: "+response.status);
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

            gateway.async(
                "GET",
                "/eventType/"+eventTypeId
            ).then(function successCallback( html ) {
                $scope.eventTypeLabel = html.data.name;
                $scope.eventTypeId = html.data.id;
                $scope.eventTypeName = html.data.name;
                $scope.parameters = html.data.mapping;

            }, function errorCallback(response){
                console.log("workflow.controller update type fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event type.");
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

        gateway.async(
            "POST",
            "/event/" + $scope.eventTypeName,
            dataObj
        ).then(function successCallback(res) {
            $scope.message = res;

            //reload events table
            $scope.getEvents();

            //clear input values
            $scope.alertMessage = null;
            $scope.eventType = null;
            toaster.pop('success', "Success", "The event was successfully sent.")

        }, function errorCallback(res) {
            console.log("workflow.controller post event fail: "+res.status);

            toaster.pop('error', "Error", "There was a problem submitting the event message.");
        });
    };

        $scope.deleteEvent = function(eventId) {

            gateway.async(
                "DELETE",
                "/event/" + eventId
            ).then(function successCallback(html) {
                $scope.message = html;
                console.log("success");

                //reload events table
                $scope.getEvents();

                toaster.pop('success', "Success", "The event was successfully deleted.");
            }, function errorCallback(response) {
                console.log("workflow.controller delete event fail: " + response.status);
                toaster.pop('error', "Error", "There was a problem deleting the event.");
            });
        };


        $scope.getAlerts = function (pageNumber) {
            $scope.alerts = "";
            $scope.errorMsg = "";

            if (pageNumber) {
                $scope.alertsPagination.current = pageNumber - 1;
            }

            var params = {
                page: $scope.alertsPagination.current,
                per_page: $scope.alertsPerPage
            };

            gateway.async(
                "GET",
                "/alert",
                null,
                params
            ).then(function successCallback( html ) {
                if(html.data != null) {
                    $scope.alerts = html.data.data;
                    $scope.totalAlerts = html.data.pagination.count;
                }
            }, function errorCallback(response){
                console.log("workflow.controller get alerts fail: "+response.status);
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

            gateway.async(
                "POST",
                "/alert",
                dataObj
            ).then(function successCallback(res) {
                $scope.message = res;

                //reload alerts table
                $scope.getAlerts();

                //set inputs to null to clear
                $scope.alertTrigger = null;
                $scope.alertEvent = null;
                toaster.pop('success', "Success", "The alert was successfully sent.")

            }, function errorCallback(res) {
                console.log("workflow.controller post alert fail: "+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the alert message.");
            });
        };

        $scope.deleteAlert = function(alertId) {
            gateway.async(
                "DELETE",
                "/alert/"+alertId
            ).then(function successCallback( html ) {
                $scope.message = html;
                console.log("success");

                //getAlerts again to reload table
                $scope.getAlerts();

                toaster.pop('success', "Success", "The alert was successfully deleted.");
            }, function errorCallback(response) {
                console.log("workflow.controller delete alert fail: "+response.status);
                toaster.pop('error', "Error", "There was a problem deleting the alert message.");
            });
        };



        $scope.getTriggers = function (pageNumber) {
            $scope.triggers = "";
            $scope.errorMsg = "";

            if (pageNumber) {
                $scope.triggersPagination.current = pageNumber - 1;
            }

            var params = {
                page: $scope.triggersPagination.current,
                per_page: $scope.triggersPerPage
            };
            gateway.async(
                "GET",
                "/trigger",
                null,
                params
            ).then(function successCallback( html ) {
                if(html.data != null) {
                    $scope.triggers = html.data.data;
                    $scope.totalTriggers = html.data.pagination.count;
                }
            }, function errorCallback(response){
                console.log("workflow.controller get triggers fail: "+response.status);
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

            gateway.async(
                "POST",
                "/trigger",
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
                console.log("workflow.controller post trigger fail: "+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the trigger message.");
            });
        };

        $scope.getTriggerById = function () {
            $scope.triggerById = "";
            $scope.triggerId = "";
            $scope.errorMsg = "";

            gateway.async(
                "GET",
                "/trigger/"+triggerId
            ).then(function successCallback( html ) {
                $scope.trigger = html.data;
            }, function errorCallback(response){
                console.log("workflow.controller get trigger by id fail: "+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the trigger.");
            });

        };

        $scope.deleteTrigger = function(triggerId){
            $scope.errorMsg = "";

            gateway.async(
                "DELETE",
                "/trigger/"+triggerId
            ).then(function successCallback(res) {
                $scope.message = res;
                $scope.getTriggers();
                $scope.workflowMessage = null;
                toaster.pop('success', "Success", "The trigger was successfully deleted.")

            }, function errorCallback(res) {
                console.log("workflow.controller delete trigger fail: "+res.status);

                toaster.pop('error', "Error", "There was a problem deleting the trigger.");
            });
        };


}

})();