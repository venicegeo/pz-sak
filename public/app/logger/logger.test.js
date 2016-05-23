/**
 * Created by jmcmahon on 5/20/2016.
 */

'use strict';

describe('Controller: LoggerController', function () {

    var $httpBackend, logsRequestHandler,
        logsCountHandler, loginHandler;
        // $cookies;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var LoggerController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        logsRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-logger.int.geointservices.io/v1/messages?from=0&size=100').respond(
            [
                {
                    "service": "Gateway",
                    "address": "gnemud7srkr/10.254.0.62",
                    "stamp": 1464035804,
                    "severity": "Info",
                    "message": "User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786."
                }
            ]
        );
        logsCountHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-logger.int.geointservices.io/v1/messages?from=0&size=10000').respond(
            [
                {
                    "service": "Gateway",
                    "address": "gnemud7srkr/10.254.0.62",
                    "stamp": 1464035804,
                    "severity": "Info",
                    "message": "User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786."
                }
            ]
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

    it('should get a count of the logs', function () {
        $httpBackend.expectGET('/proxy/pz-logger.int.geointservices.io/v1/messages?from=0&size=10000');
        $httpBackend.flush();
        expect(scope.logCount).toBe(1);
    });

    it('should get the first 100 logs', function () {
        $httpBackend.expectGET('/proxy/pz-logger.int.geointservices.io/v1/messages?from=0&size=100');
        $httpBackend.flush();
        expect(scope.logs[0].service).toBe('Gateway');
        expect(scope.logs[0].address).toBe('gnemud7srkr/10.254.0.62');
        expect(scope.logs[0].stamp).toBe(1464035804);
        expect(scope.logs[0].severity).toBe('Info');
        expect(scope.logs[0].message).toBe('User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786.');
    });

});