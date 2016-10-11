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

describe('Controller: JobsAdminController', function () {

    var $httpBackend, statusRequestHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var JobsAdminController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        statusRequestHandler = $httpBackend.when(
            'GET',
            '/proxy?url=pz-jobmanager.int.geointservices.io/admin/stats').respond(
            {
                "running": 299,
                "activeThreads": 0
            }
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        JobsAdminController = $controller('JobsAdminController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the admin stats', function () {
        scope.getAdminStats();
        $httpBackend.expectGET('/proxy?url=pz-jobmanager.int.geointservices.io/admin/stats');
        $httpBackend.flush();
        expect(scope.adminData.running).toBe(299);
        expect(scope.adminData.activeThreads).toBe(0);
    });

});