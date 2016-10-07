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