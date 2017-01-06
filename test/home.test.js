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

describe('Controller: HomeController', function () {

    var $httpBackend,
        loggerRequestHandler,
        uuidRequestHandler,
        workflowRequestHandler,
        searchRequestHandler,
        serviceControllerRequestHandler,
        gatewayRequestHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var HomeController,
        discover,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        discover = $injector.get('discover');
        loggerRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.loggerHost + '/').respond(
            {
                "statusCode": 200,
                "type": "string",
                "data": "Hi. I'm pz-logger."
            }
        );
        uuidRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.uuidHost + '/').respond(
            {
                "statusCode": 200,
                "data": "Hi. I'm pz-uuidgen."
            }
        );
        workflowRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.workflowHost + '/').respond(
            {
                "statusCode": 200,
                "data": "Hi! I'm pz-workflow."
            }
        );
        searchRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.searchHost + '/').respond(
            "Hello Piazza Search Query! DSL-input endpoint at /api/v1/datafull"
        );
        serviceControllerRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.serviceControllerHost + '/').respond(
            "servicecontroller ok"
        );
        gatewayRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.gatewayHost + '/').respond(
            "Hello, Health Check here for pz-gateway."
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        HomeController = $controller('HomeController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the running services', function () {
        scope.getRunningServices();
        expect(scope.services.loggerHost).toBe(discover.loggerHost);
    });

    it('should get health checks', function () {
        scope.getStatuses();
        $httpBackend.expectGET('/proxy/' + discover.loggerHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.uuidHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.workflowHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.searchHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.serviceControllerHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.gatewayHost + '/');
        $httpBackend.flush();
        expect(scope.loggerStatus).toBe("green");
        expect(scope.uuidStatus).toBe("green");
        expect(scope.workflowStatus).toBe("green");
        expect(scope.searchStatus).toBe("green");
        expect(scope.serviceControllerStatus).toBe("green");
        expect(scope.gatewayStatus).toBe("green");
    });

    it('should get failure health checks', function () {
        loggerRequestHandler.respond(500, '');
        uuidRequestHandler.respond(500, '');
        workflowRequestHandler.respond(500, '');
        searchRequestHandler.respond(500, '');
        serviceControllerRequestHandler.respond(500, '');
        gatewayRequestHandler.respond(500, '');
        scope.getStatuses();
        $httpBackend.expectGET('/proxy/' + discover.loggerHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.uuidHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.workflowHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.searchHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.serviceControllerHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.gatewayHost + '/');
        $httpBackend.flush();
        expect(scope.loggerStatus).toBe("red");
        expect(scope.uuidStatus).toBe("red");
        expect(scope.workflowStatus).toBe("red");
        expect(scope.searchStatus).toBe("red");
        expect(scope.serviceControllerStatus).toBe("red");
        expect(scope.gatewayStatus).toBe("red");
    });

    it('should get failure health checks alt', function () {
        loggerRequestHandler.respond(201, '');
        uuidRequestHandler.respond(201, '');
        workflowRequestHandler.respond(201, '');
        searchRequestHandler.respond(201, '');
        serviceControllerRequestHandler.respond(201, '');
        gatewayRequestHandler.respond(201, '');
        scope.getStatuses();
        $httpBackend.expectGET('/proxy/' + discover.loggerHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.uuidHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.workflowHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.searchHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.serviceControllerHost + '/');
        $httpBackend.expectGET('/proxy/' + discover.gatewayHost + '/');
        $httpBackend.flush();
        expect(scope.loggerStatus).toBe("red");
        expect(scope.uuidStatus).toBe("red");
        expect(scope.workflowStatus).toBe("red");
        expect(scope.searchStatus).toBe("red");
        expect(scope.serviceControllerStatus).toBe("red");
        expect(scope.gatewayStatus).toBe("red");
    });
});
