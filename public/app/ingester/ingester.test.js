/**
 * Created by jmcmahon on 5/24/2016.
 */

'use strict';

describe('Controller: IngesterController', function () {

    var $httpBackend, $document;
    var ingestTextRequestHandler,
        ingestFileRequestHandler, jobStatusHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var IngestController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        $document = $injector.get('$document');
        ingestTextRequestHandler = $httpBackend.when(
            'POST',
            '/proxy?url=pz-gateway.int.geointservices.io/data',
            '{"type":"ingest","host":"true","data":{"dataType":{"type":"text","content":"some text to ingest"},"metadata":{}}}')
            .respond(
            {
                jobId: "4e7d24b9-91d8-4f39-950b-3e254ad82d05"
            }
        );
        // This needs to be form data
        ingestFileRequestHandler = $httpBackend.when(
            'POST',
            '/proxy/pz-gateway.int.geointservices.io/data/file',
            '------WebKitFormBoundaryMBGwzlWj0FoVC4TW Content-Disposition: form-data; name="data" {"type":"ingest","host":"true","data":{"dataType":{"type":"raster"},"metadata":{"name":"Elevation","classification":"unclassified"}}} ------WebKitFormBoundaryMBGwzlWj0FoVC4TW Content-Disposition: form-data; name="file"; filename="elevation.tif" Content-Type: image/tiff ------WebKitFormBoundaryMBGwzlWj0FoVC4TW--',
            {
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryMBGwzlWj0FoVC4TW",
                "Authorization":"Basic"
            })
            .respond(
            {
                jobId: "4e7d24b9-91d8-4f39-950b-3e254ad82d05"
            }
        );
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
        IngestController = $controller('IngesterController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should ingest text', function () {
        $document[0].write('<input id="file" type="file" class="form-control"accept="image/*" ng-required="ingestType == \'File\'" >');
        scope.ingestType= "Text";
        scope.message = "some text to ingest";
        scope.ingest();
        $httpBackend.expectPOST('/proxy?url=pz-gateway.int.geointservices.io/data', '{"type":"ingest","host":"true","data":{"dataType":{"type":"text","content":"some text to ingest"},"metadata":{}}}');
        $httpBackend.flush();
        expect(scope.jobIdResult).toBe("4e7d24b9-91d8-4f39-950b-3e254ad82d05");
    });

    it('should ingest a raster file', function () {
        scope.ingestType = "File";
        scope.file = "elevation.tif"
        scope.jobIdResult = "4e7d24b9-91d8-4f39-950b-3e254ad82d05";
        scope.ingest();
        // TODO: Figure FormData out
        /*$httpBackend.expectPOST('/proxy?url=pz-gateway.int.geointservices.io/data/file',
            '------WebKitFormBoundaryMBGwzlWj0FoVC4TW Content-Disposition: form-data; name="data" {"type":"ingest","host":"true","data":{"dataType":{"type":"raster"},"metadata":{"name":"Elevation","classification":"unclassified"}}} ------WebKitFormBoundaryMBGwzlWj0FoVC4TW Content-Disposition: form-data; name="file"; filename="elevation.tif" Content-Type: image/tiff ------WebKitFormBoundaryMBGwzlWj0FoVC4TW--',
            {
                "Content-Type":"multipart/form-data; boundary=----WebKitFormBoundaryMBGwzlWj0FoVC4TW",
                "Authorization":"Basic"
            }
        );*/
        $httpBackend.flush();
        expect(scope.jobIdResult).toBe("4e7d24b9-91d8-4f39-950b-3e254ad82d05");
    });

    it('should get job status', function () {
        scope.jobId = "4e7d24b9-91d8-4f39-950b-3e254ad82d05";
        scope.getJobStatus();
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/job/4e7d24b9-91d8-4f39-950b-3e254ad82d05');
        $httpBackend.flush();
        expect(scope.jobStatus.jobId).toBe("4e7d24b9-91d8-4f39-950b-3e254ad82d05");
        expect(scope.jobStatus.status).toBe("Success");
    });

});