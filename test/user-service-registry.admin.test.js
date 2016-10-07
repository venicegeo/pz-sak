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

describe('Controller: UserServiceRegistryAdminController', function () {

    var $httpBackend;
    var metricsHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var UserServiceRegistryAdminController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');

        metricsHandler = $httpBackend.when(
            'GET',
            '/proxy?url=pz-servicecontroller.int.geointservices.io/metrics')
            .respond({"mem":597583,"mem.free":364044,"processors":8,"instance.uptime":6121683,"uptime":6127141,"systemload.average":0.02,"heap.committed":508416,"heap.init":524288,"heap.used":144371,"heap":508416,"nonheap.committed":91072,"nonheap.init":2496,"nonheap.used":89168,"nonheap":1504048,"threads.peak":35,"threads.daemon":26,"threads.totalStarted":268,"threads":31,"classes":9071,"classes.loaded":9071,"classes.unloaded":0,"gc.ps_scavenge.count":31,"gc.ps_scavenge.time":248,"gc.ps_marksweep.count":0,"gc.ps_marksweep.time":0,"httpsessions.max":-1,"httpsessions.active":0,"gauge.response.service.serviceId":2.0,"gauge.response.service":11.0,"gauge.response.registerService":623.0,"counter.status.200.registerService":46,"counter.status.200.service.serviceId":192,"counter.status.200.service":38,"counter.status.404.service.serviceId":50});
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        UserServiceRegistryAdminController = $controller('UserServiceRegistryAdminController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get metrics', function () {
        scope.getStatus();
        $httpBackend.expectGET('/proxy?url=pz-servicecontroller.int.geointservices.io/metrics');
        $httpBackend.flush();
        expect(scope.classes).toBe(9071);
        expect(scope.mem).toBe(597583);
    });

    it('should get the uptime', function () {
        var time = moment.duration("01:00:00");
        var date = moment();
        date.subtract(time);
        var uptime = scope.getUptime(date.format());
        $httpBackend.flush();
        expect(uptime).toBe("an hour ago");
    });
    
});