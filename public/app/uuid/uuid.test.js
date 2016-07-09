/**
 * Created by jmcmahon on 5/20/2016.
 */

'use strict';

describe('Controller: UuidController', function () {

    var $httpBackend, uuidsRequestHandler, loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var UuidController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        uuidsRequestHandler = $httpBackend.when(
            'POST',
            '/proxy?url=pz-uuidgen.int.geointservices.io/uuids?count=2').respond(
            {
                "data": [
                    "aaa",
                    "bbb"
                ]
            }
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        UuidController = $controller('UuidController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get two uuids', function () {
        scope.uuidCount = 2;
        scope.getUUIDs();
        $httpBackend.expectPOST('/proxy?url=pz-uuidgen.int.geointservices.io/uuids?count=2');
        $httpBackend.flush();
        expect(scope.uuids.length).toBe(2);
        expect(scope.uuids[0]).toBe("aaa");
        expect(scope.uuids[1]).toBe("bbb");
    });


});