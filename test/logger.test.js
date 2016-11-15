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

describe('Controller: LoggerController', function () {

    var $httpBackend,
        logsRequestHandler,
        logsAltRequestHandler,
        logsPostHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var LoggerController,
        discover,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        discover = $injector.get('discover');
        logsRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.loggerHost + '/message?page=0&perPage=100').respond(
            {"statusCode": 200,
                "data": [
                {
                    "service": "Gateway",
                    "address": "gnemud7srkr/10.254.0.62",
                    "createdOn": "2016-07-14T20:44:50.2344549Z",
                    "severity": "Info",
                    "message": "User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786."
                }
            ],
            "pagination": {
                "count": 1
            }}
        );
        logsAltRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.loggerHost + '/message?perPage=100&page=0').respond(
            {"statusCode": 200,
                "data": [
                {
                    "service": "Gateway",
                    "address": "gnemud7srkr/10.254.0.62",
                    "createdOn": "2016-07-14T20:44:50.2344549Z",
                    "severity": "Info",
                    "message": "User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786."
                }
            ],
            "pagination": {
                "count": 1
            }}
        );
        logsPostHandler = $httpBackend.when(
            'POST',
            '/proxy?url=' + discover.loggerHost + '/message',
            {
                "service": "sakui-log-tester",
                "address": "128.1.2.3",
                "createdOn": "2016-10-07T02:39:16.424Z",
                "severity": "Info",
                "message": "This is a test"
            }
        ).respond(
            {
                "statusCode": 200,
                "type": "logmessage",
                "data": {
                    "service": "sakui-log-tester",
                    "address": "128.1.2.3",
                    "createdOn": "2016-10-07T02:39:16.424Z",
                    "severity": "Info",
                    "message": "This is a test"
                }
            }
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        LoggerController = $controller('LoggerController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have page size default to 100', function () {
        $httpBackend.flush();
        expect(scope.size).toBe(100);
    });

    it('should get the first 100 logs', function () {
        scope.getLogs(0);
        $httpBackend.expectGET('/proxy/' + discover.loggerHost + '/message?page=0&perPage=100');
        $httpBackend.flush();
        expect(scope.logs[0].service).toBe('Gateway');
        expect(scope.logs[0].address).toBe('gnemud7srkr/10.254.0.62');
        expect(scope.logs[0].createdOn).toBe("2016-07-14T20:44:50.2344549Z");
        expect(scope.logs[0].severity).toBe('Info');
        expect(scope.logs[0].message).toBe('User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786.');
    });
    it('should post log', function () {
        scope.logMessage = "This is a test";
        scope.postLog("2016-10-07T02:39:16.424Z");
        $httpBackend.expectPOST('/proxy?url=' + discover.loggerHost + '/message',
        {
            "service": "sakui-log-tester",
            "address": "128.1.2.3",
            "createdOn": "2016-10-07T02:39:16.424Z",
            "severity": "Info",
            "message": "This is a test"
        });
        scope.pagination.current = 0;
        scope.size = 100;
        $httpBackend.expectGET('/proxy/' + discover.loggerHost + '/message?page=0&perPage=100');
        $httpBackend.flush();
        expect(scope.logs[0].service).toBe('Gateway');
        expect(scope.logs[0].address).toBe('gnemud7srkr/10.254.0.62');
        expect(scope.logs[0].createdOn).toBe("2016-07-14T20:44:50.2344549Z");
        expect(scope.logs[0].severity).toBe('Info');
        expect(scope.logs[0].message).toBe('User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786.');
    });

});