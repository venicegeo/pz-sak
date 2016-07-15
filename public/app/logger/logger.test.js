/**
 * Created by jmcmahon on 5/20/2016.
 */

'use strict';

describe('Controller: LoggerController', function () {

    var $httpBackend, logsRequestHandler, loginHandler;
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
            '/proxy/pz-logger.int.geointservices.io/message?page=0&perPage=100').respond(
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
        $httpBackend.expectGET('/proxy/pz-logger.int.geointservices.io/message?page=0&perPage=100');
        $httpBackend.flush();
        expect(scope.logs[0].service).toBe('Gateway');
        expect(scope.logs[0].address).toBe('gnemud7srkr/10.254.0.62');
        expect(scope.logs[0].createdOn).toBe("2016-07-14T20:44:50.2344549Z");
        expect(scope.logs[0].severity).toBe('Info');
        expect(scope.logs[0].message).toBe('User UNAUTHENTICATED requested Job Status for febb497e-cd11-4ea7-ab02-e6601aded786.');
    });

});