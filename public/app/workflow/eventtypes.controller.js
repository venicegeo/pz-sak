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
        .controller('EventtypesController', ['$scope', '$http', '$log', '$q',  'toaster', 'discover', EventtypesController]);

    function EventtypesController ($scope, $http, $log, $q, toaster, discover) {

        $scope.showNewEventTypeForm = false;
        $scope.showEventTypeTable = false;
        $scope.eventTypeMappings = [];
        $scope.disableEventTypeName = false;


        $scope.clearForm = function (){
            $scope.disableEventTypeName = false;
            $scope.newEventTypeName = null;
            $scope.newEventTypeParameterName = "";
            $scope.newEventTypeDataType = "";
            $scope.eventTypeMappings = [];

        }
        $scope.addMapping = function (){

            if (!$scope.showEventTypeTable){
                $scope.showNewEventTypeForm = true;
            }
            else{
                $scope.showNewEventTypeForm = false;
            }

            var parameterName = $scope.newEventTypeParameterName;
            var parameterDatatype = $scope.newEventTypeDataType;

            var newMapping = {};
            newMapping[parameterName] = parameterDatatype;

            $scope.eventTypeMappings.push(newMapping);
            $scope.eventTypeName = $scope.newEventTypeName;


            $scope.disableEventTypeName = true;
            $scope.newEventTypeParameterName = "";
            $scope.newEventTypeDataType = "";
        }

        $scope.deleteEventMapping = function(mapKey){
            $scope.eventTypeMappings.splice(mapKey, 1);
        }

        $scope.updateTypeTable = function (eventTypeId) {

            if (!$scope.showEventTypeTable){
                $scope.showEventTypeTable = true;
            }
            else{
                $scope.showeventTypeTable = false;
            }

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/eventtypes/"+eventTypeId,
            }).then(function successCallback( html ) {
                $scope.eventTypeId = html.data.id;
                $scope.eventTypeName = html.data.name;
                $scope.eventTypeMapping = html.data.mapping;

            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
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
            $scope.clearForm();
        };


        $scope.loadPostEventType = function() {

            $scope.showHideEventTypeTable();

        };

        $scope.getEventTypes = function () {
            $scope.eventType = "";
            $scope.eventTypes = [];

            $http({
                method: "GET",
                url: "/proxy?url=" + discover.workflowHost + "/v1/eventtypes",
            }).then(function successCallback( html ) {
                $scope.eventTypes = html.data;
            }, function errorCallback(response){
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was an issue with retrieving the event types.");
            });

        };

        $scope.createEventType = function(newEventType) {

            var mapping = {};
            $scope.eventTypeMappings.forEach(function(item) {
                var keys = Object.keys(item);
                var key = keys[0];
                mapping[key] = item[key];
            });

            var typeName = $scope.eventTypeName;
            if (angular.isUndefined(typeName) || typeName === "") {
                typeName = $scope.newEventTypeName;
            }
            var eventDataObj = {
                "name": typeName,
                "mapping" : mapping
            };
            $http.post(
                "/proxy?url=" + discover.workflowHost + "/v1/eventtypes",
                eventDataObj
            ).then(function successCallback(res) {
                $scope.message = res;

                //reload events table
                $scope.getEventTypes();

                //clear input values
                $scope.eventTypeName = null;
                $scope.newEventTypeMapping = null;
                $scope.eventTypeMappings = [];
                $scope.newEventTypeName = "";
                $scope.showHideNewEventType();
                $scope.disableEventTypeName = false;


                toaster.pop('success', "Success", "The event was successfully posted.")

            }, function errorCallback(res) {
                console.log("workflow.controller fail"+res.status);

                toaster.pop('error', "Error", "There was a problem submitting the event message.");
            });
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
                method: "DELETE",
                url: "/proxy?url=" + discover.workflowHost + "/v1/eventtypes/"+eventTypeId,
            }).then(function successCallback( html ) {
                $scope.message = html;
                console.log("success");

                $scope.eventTypeId = "";
                $scope.eventTypeName = "";
                $scope.eventTypeMapping = "";

                $scope.getEventTypes();

                toaster.pop('success', "Success", "The eventtype was successfully deleted.");
            }, function errorCallback(response) {
                console.log("workflow.controller fail"+response.status);
                toaster.pop('error', "Error", "There was a problem deleting the eventtype.");
            });
        };
    }

})();