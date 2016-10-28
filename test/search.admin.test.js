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

describe('Controller: SearchAdminController', function () {

    var $httpBackend, metricsRequestHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var SearchAdminController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        metricsRequestHandler = $httpBackend.when(
            'GET',
            '/proxy?url=pz-search-query.int.geointservices.io/metrics').respond(
            {
                "mem":403869,
                "mem.free":255862,
                "processors":8,
                "instance.uptime":947696516,
                "uptime":947767321
            }

        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        SearchAdminController = $controller('SearchAdminController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the version', function () {
        scope.getStatus();
        $httpBackend.expectGET('/proxy?url=pz-search-query.int.geointservices.io/metrics');
        $httpBackend.flush();
        expect(scope.adminData.mem).toBe(403869);
    });

});