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
        .controller('WorkflowController', ['$scope', 'toaster', 'gateway', 'settings', WorkflowController]);

    function WorkflowController ($scope, toaster, gateway, settings) {
        $scope.elasticSearchLimit = settings.elasticSearchLimit;
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
                perPage: $scope.eventsPerPage
            };

            gateway.async(
                "GET",
                "/event",
                null,
                params
            ).then(function( html ) {
                if (html.data != null) {
                    $scope.events = html.data.data;
                    $scope.actualEventCount = html.data.pagination.count;
                    $scope.totalEvents = ($scope.actualEventCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualEventCount;
                }
            }, function(){
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

        $scope.getEventTypes = function () {
            $scope.eventType = "";
            $scope.eventTypes = [];

            var params = {
                page: 0,
                perPage: 10000
            };
            gateway.async(
                "GET",
                "/eventType",
                null,
                params
            ).then(function( html ) {
                if(html.data != null) {
                    $scope.eventTypes = html.data.data;
                    $scope.selectedEventTypes = html.data.data;
                }
            }, function(){
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
            });

        };
        $scope.updateTypeTable = function (eventTypeId) {

            $scope.showNewEventForm = !$scope.showEventForm;

            gateway.async(
                "GET",
                "/eventType/"+eventTypeId
            ).then(function( html ) {
                $scope.eventTypeLabel = html.data.data.name;
                $scope.eventTypeId = html.data.data.eventTypeId;
                $scope.eventTypeName = html.data.data.name;
                $scope.parameters = html.data.data.mapping;

            }, function(){
                toaster.pop('error', "Error", "There was an issue with retrieving the event type.");
            });

        };

        $scope.selectEventType = function(newEventType) {
            //User selected to create an event associated with an event type
            $scope.showHideNewEventForm();
            $scope.newEventType = newEventType;
        };





    $scope.postEvent = function(params){
        var array = $.map(params, function(value, index) {
            return [index];
        });

        var result = {};
        for(var i=0;i<array.length;i++){
            result[array[i]] = $scope.eventTypeValues[i];
        }

        $scope.errorMsg = "";

        var currentTime = moment().utc().toISOString();
        var dataObj = {
            eventTypeId: $scope.eventType.eventTypeId,
            createdOn: currentTime,
            data: result
        };

        gateway.async(
            "POST",
            "/event/" + $scope.eventTypeName,
            dataObj
        ).then(function(res) {
            $scope.message = res;

            //reload events table
            $scope.getEvents();

            //clear input values
            $scope.eventType = null;
            toaster.pop('success', "Success", "The event was successfully sent.");

        }, function() {
            toaster.pop('error', "Error", "There was a problem submitting the event message.");
        });
    };

        $scope.deleteEvent = function(eventId) {

            gateway.async(
                "DELETE",
                "/event/" + eventId
            ).then(function(html) {
                $scope.message = html;

                //reload events table
                $scope.getEvents();

                toaster.pop('success', "Success", "The event was successfully deleted.");
            }, function() {
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
                perPage: $scope.alertsPerPage
            };

            gateway.async(
                "GET",
                "/alert",
                null,
                params
            ).then(function( html ) {
                if(html.data != null) {
                    $scope.alerts = html.data.data;
                    $scope.actualAlertCount = html.data.pagination.count;
                    $scope.totalAlerts = ($scope.actualAlertCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualAlertCount;
                }
            }, function(){
                toaster.pop('error', "Error", "There was an issue with retrieving the alerts.");
            });

        };

        $scope.postAlert = function(){
            $scope.errorMsg = "";
            var alertTrigger = $scope.alertTrigger;
            var alertEvent = $scope.alertEvent;
            var dataObj = {
                triggerId: alertTrigger,
                eventId: alertEvent
            };

            gateway.async(
                "POST",
                "/alert",
                dataObj
            ).then(function(res) {
                $scope.message = res;

                //reload alerts table
                $scope.getAlerts();

                //set inputs to null to clear
                $scope.alertTrigger = null;
                $scope.alertEvent = null;
                toaster.pop('success', "Success", "The alert was successfully sent.");

            }, function() {
                toaster.pop('error', "Error", "There was a problem submitting the alert message.");
            });
        };

        $scope.deleteAlert = function(alertId) {
            gateway.async(
                "DELETE",
                "/alert/"+alertId
            ).then(function( html ) {
                $scope.message = html;

                //getAlerts again to reload table
                $scope.getAlerts();

                toaster.pop('success', "Success", "The alert was successfully deleted.");
            }, function() {
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
                perPage: $scope.triggersPerPage
            };
            gateway.async(
                "GET",
                "/trigger",
                null,
                params
            ).then(function( html ) {
                if(html.data != null) {
                    $scope.triggers = html.data.data;
                    $scope.actualTriggerCount = html.data.pagination.count;
                    $scope.totalTriggers = ($scope.actualTriggerCount > $scope.elasticSearchLimit) ? $scope.elasticSearchLimit : $scope.actualTriggerCount;
                }
            }, function(){
                toaster.pop('error', "Error", "There was an issue with retrieving the triggers.");
            });

        };

        $scope.postTrigger = function(){
            $scope.errorMsg = "";
            // TODO: Fix this! No longer takes a list of eventTypes
            var eventTriggerType = [];

            for(var i=0;i<$scope.selectedEventTypes.length;i++){
                eventTriggerType[i] = $scope.selectedEventTypes[i].id;
            }

            var currentTime = moment().utc().toISOString();
            var dataObj = {

                title: $scope.triggerTitle,
                eventTypeId: eventTriggerType,
                condition:{
                    query: angular.fromJson($scope.triggerQuery)
                },
                job: {
                    task: JSON.parse($scope.triggerJob)
                }
            };

            gateway.async(
                "POST",
                "/trigger",
                dataObj
            ).then(function(res) {
                $scope.message = res;

                //reload table
                $scope.getTriggers();

                //set input fields to null to clear
                $scope.triggerTitle = null;
                $scope.triggerQuery = null;
                $scope.selectedEventTypes = null;
                $scope.triggerJob = null;
                toaster.pop('success', "Success", "The trigger was successfully posted.");

            }, function() {
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
            ).then(function( html ) {
                $scope.trigger = html.data;
            }, function(){
                toaster.pop('error', "Error", "There was an issue with retrieving the trigger.");
            });

        };

        $scope.deleteTrigger = function(triggerId){
            $scope.errorMsg = "";

            gateway.async(
                "DELETE",
                "/trigger/"+triggerId
            ).then(function(res) {
                $scope.message = res;
                $scope.getTriggers();
                $scope.workflowMessage = null;
                toaster.pop('success', "Success", "The trigger was successfully deleted.");

            }, function() {
                toaster.pop('error', "Error", "There was a problem deleting the trigger.");
            });
        };


}

})();