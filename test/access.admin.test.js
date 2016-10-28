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

'use strict';

describe('Controller: AccessAdminController', function () {

    var $httpBackend, statusRequestHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var AccessAdminController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        statusRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-access.int.geointservices.io/admin/stats').respond(
            {
                "activeThreads": 200,
                "threadQueue": 300
            }
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        AccessAdminController = $controller('AccessAdminController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the admin stats', function () {
        scope.getStats();
        $httpBackend.expectGET('/proxy/pz-access.int.geointservices.io/admin/stats');
        $httpBackend.flush();
        expect(scope.adminStats.activeThreads).toBe(200);
        expect(scope.adminStats.threadQueue).toBe(300);
    });


});