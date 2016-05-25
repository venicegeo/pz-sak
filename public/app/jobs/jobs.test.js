/**
 * Created by jmcmahon on 5/25/2016.
 */

'use strict';

describe('Controller: JobsController', function () {

    var $httpBackend, $document;
    var jobsListRequestHandler,
        jobsCountRequestHandler,
        resourceDataHandler,
        allStatusesHandler,
        jobsByUserHandler,
        jobStatusHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var JobsController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        $document = $injector.get('$document');
        jobsListRequestHandler = $httpBackend.when(
            'GET',
            "/proxy/pz-jobmanager.int.geointservices.io/job?page=0&pageSize=10")
            .respond(

                [
                {
                    "jobId": "4e7d24b9-91d8-4f39-950b-3e254ad82d05",
                    "jobType": {
                        "type": "ingest",
                        "data": {
                            "dataType": {
                                "type": "shapefile",
                                "location": {
                                    "type": "s3",
                                    "bucketName": "pz-blobstore-int",
                                    "fileName": "4e7d24b9-91d8-4f39-950b-3e254ad82d05-SheltersShp.zip",
                                    "domainName": "s3.amazonaws.com"
                                }
                            },
                            "metadata": {
                                "name": "My Test Shapefile",
                                "description": "This is a test.",
                                "classType": {
                                    "classification": "unclassified"
                                }
                            }
                        },
                        "host": true
                    },
                    "submitterUserName": "UNAUTHENTICATED",
                    "status": "Success",
                    "progress": {
                        "percentComplete": 100
                    },
                    "history": [],
                    "result": {
                        "type": "data",
                        "dataId": "3ca9d6c7-163c-45e7-8e62-0bb834c07a9f"
                    },
                    "submitted": "2016-04-28T16:20:10.933Z"
                }
                ]
            );

        // This needs to be form data
        jobsCountRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-jobmanager.int.geointservices.io/job/count')
            .respond(1);
        jobStatusHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/job/4e7d24b9-91d8-4f39-950b-3e254ad82d05').respond(
            {
                "type" : "status",
                "jobId" : "4e7d24b9-91d8-4f39-950b-3e254ad82d05",
                "result" : {
                    "type" : "data",
                    "dataId" : "3ca9d6c7-163c-45e7-8e62-0bb834c07a9f"
                },
                "status" : "Success",
                "jobType" : "ingest",
                "submittedBy" : "UNAUTHENTICATED",
                "progress" : {
                    "percentComplete" : 100
                }
            });
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        JobsController = $controller('JobsController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get job status', function () {
        scope.jobId = "4e7d24b9-91d8-4f39-950b-3e254ad82d05";
        scope.getJobStatus();
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/job/4e7d24b9-91d8-4f39-950b-3e254ad82d05');
        $httpBackend.flush();
        expect(scope.jobStatusResult.jobId).toBe("4e7d24b9-91d8-4f39-950b-3e254ad82d05");
        expect(scope.jobStatusResult.status).toBe("Success");
    });

});