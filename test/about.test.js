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

describe('Controller: AboutController', function () {

    var $httpBackend, versionRequestHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var AboutController,
        discover,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        discover = $injector.get('discover');
        versionRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/' + discover.gatewayHost + '/version').respond(
            {
                "version": "1.1.1-ci-322-g938125e-ci",
                "components": {
                    "pz-access": "Sprint06-137-ga6d30c8",
                    "pz-docs": "74e3a4d",
                    "pz-gateway": "Sprint06-320-gf0a0ef1",
                    "pz-ingest": "Sprint06-114-geb81c0e",
                    "pz-jobmanager": "Sprint06-117-g86d155a",
                    "pz-logger": "Sprint03-252-g640fe61",
                    "pz-sak": "Sprint06-132-g5f98212",
                    "pz-search-metadata-ingest": "prepruning-0-gd0fe9e6",
                    "pz-search-query": "Sprint03-36-g80d6c18",
                    "pz-idam": "a5deb81",
                    "pz-servicecontroller": "SPRINT03-328-g0057fca",
                    "pz-swagger": "v2.1.4-41-g86e6e5f",
                    "pz-workflow": "Sprint03-642-g3516425",
                    "pzsvc-hello": "767ae0c",
                    "pzsvc-preview-generator": "Sprint03-16-g04f2cfe"
                }
            }
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        AboutController = $controller('AboutController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the version', function () {
        scope.getVersionNumber();
        $httpBackend.expectGET('/proxy/' + discover.gatewayHost + '/version');
        $httpBackend.flush();
        expect(scope.versionNumber).toBe("1.1.1-ci-322-g938125e-ci");
    });

});