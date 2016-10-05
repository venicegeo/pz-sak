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

describe('Controller: JobsController', function () {

    var $httpBackend;
    var jobsListRequestHandler,
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
        jobsListRequestHandler = $httpBackend.when(
            'GET',
            "/proxy/pz-jobmanager.int.geointservices.io/job?order=desc&page=0&perPage=10")
            .respond(
                {"statusCode": 200,
                "data": [
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
                ],
                "pagination":{
                    "count": 1
                }}
            );

        resourceDataHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/data/4ad8487a-e11c-4be2-98a8-23873d95d360')
            .respond({
                "type" : "data",
                "data" : {
                    "dataId" : "4ad8487a-e11c-4be2-98a8-23873d95d360",
                    "dataType" : {
                        "type" : "raster",
                        "location" : {
                            "type" : "s3",
                            "bucketName" : "external-public-access-test",
                            "fileName" : "elevation.tif",
                            "domainName" : "s3.amazonaws.com",
                        }
                    },
                    "spatialMetadata" : {
                        "coordinateReferenceSystem" : "PROJCS[\"WGS 84 / UTM zone 32N\", \n  GEOGCS[\"WGS 84\", \n    DATUM[\"World Geodetic System 1984\", \n      SPHEROID[\"WGS 84\", 6378137.0, 298.257223563, AUTHORITY[\"EPSG\",\"7030\"]], \n      AUTHORITY[\"EPSG\",\"6326\"]], \n    PRIMEM[\"Greenwich\", 0.0, AUTHORITY[\"EPSG\",\"8901\"]], \n    UNIT[\"degree\", 0.017453292519943295], \n    AXIS[\"Geodetic latitude\", NORTH], \n    AXIS[\"Geodetic longitude\", EAST], \n    AUTHORITY[\"EPSG\",\"4326\"]], \n  PROJECTION[\"Transverse_Mercator\", AUTHORITY[\"EPSG\",\"9807\"]], \n  PARAMETER[\"central_meridian\", 9.0], \n  PARAMETER[\"latitude_of_origin\", 0.0], \n  PARAMETER[\"scale_factor\", 0.9996], \n  PARAMETER[\"false_easting\", 500000.0], \n  PARAMETER[\"false_northing\", 0.0], \n  UNIT[\"m\", 1.0], \n  AXIS[\"Easting\", EAST], \n  AXIS[\"Northing\", NORTH], \n  AUTHORITY[\"EPSG\",\"32632\"]]",
                        "epsgCode" : 32632,
                        "minX" : 496147.97,
                        "minY" : 5422119.88,
                        "maxX" : 496545.97,
                        "maxY" : 5422343.88
                    },
                    "metadata" : {
                        "name" : "My Test raster external file",
                        "description" : "This is a test.",
                        "classType" : {
                            "classification" : "unclassified"
                        }
                    }
                }
            });
        allStatusesHandler = $httpBackend.when(
            'GET',
            '/proxy?url=pz-jobmanager.int.geointservices.io/job/status')
            .respond(["Cancelled","Error","Fail","Pending","Running","Submitted","Success"]);
        jobsByUserHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-jobmanager.int.geointservices.io/job?order=desc&page=0&perPage=10&userName=citester')
            .respond({"data": [
                {
                    "jobId": "92f84c34-bd0e-43fd-a8a0-30f863fbf527",
                    "jobType": {
                        "type": "execute-service",
                        "data": {
                            "serviceId": "c167c5bb-1947-4177-b5cb-fb10187343dd",
                            "dataInputs": {
                                "cmd": {
                                    "type": "urlparameter",
                                    "content": "shoreline --image e32b37c5-dc6e-4c7b-b11e-81a23ebdbb0a.TIF,2aab2e30-a612-4c5a-8351-324e57a9e993.TIF --projection geo-scaled --threshold 0.5 --tolerance 0 Beachfront_Postman_Manual_Testing_Again.geojson"
                                },
                                "inFiles": {
                                    "type": "urlparameter",
                                    "content": "e32b37c5-dc6e-4c7b-b11e-81a23ebdbb0a,2aab2e30-a612-4c5a-8351-324e57a9e993"
                                },
                                "outGeoJson": {
                                    "type": "urlparameter",
                                    "content": "Beachfront_Postman_Manual_Testing_Again.geojson"
                                }
                            },
                            "dataOutput": [
                                {
                                    "type": "text",
                                    "mimeType": "application/json"
                                }
                            ]
                        }
                    },
                    "submitterUserName": "citester",
                    "status": "Success",
                    "progress": {},
                    "history": [],
                    "result": {
                        "type": "data",
                        "dataId": "db1ab88b-26f6-49ab-990e-ee9321963a07"
                    },
                    "submitted": "2016-05-16T21:09:41.278Z"
                }
            ],
            "pagination": {
                "count": 1
            }}
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
        JobsController = $controller('JobsController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get list of jobs', function () {
        scope.updateFilter(true);
        $httpBackend.expectGET('/proxy/pz-jobmanager.int.geointservices.io/job?order=desc&page=0&perPage=10');
        $httpBackend.flush();
        expect(scope.jobsList.length).toBe(1);
        expect(scope.jobsList[0].jobId).toBe("4e7d24b9-91d8-4f39-950b-3e254ad82d05");
    });
    it('should get resource data', function () {
        scope.resourceId = "4ad8487a-e11c-4be2-98a8-23873d95d360";
        scope.getResourceData();
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/data/4ad8487a-e11c-4be2-98a8-23873d95d360');
        $httpBackend.flush();
        expect(scope.resourceData.type).toBe("data");
        expect(scope.resourceData.data.dataId).toBe("4ad8487a-e11c-4be2-98a8-23873d95d360");
        expect(scope.resourceData.data.metadata.description).toBe("This is a test.");
    });
    it('should get all possible statuses', function () {
        scope.getAllStatuses();
        $httpBackend.expectGET('/proxy?url=pz-jobmanager.int.geointservices.io/job/status');
        $httpBackend.flush();
        expect(scope.jobStatuses.length).toBe(8);
        expect(scope.jobStatuses[0]).toBe("Cancelled");
        expect(scope.jobStatuses[7]).toBe("All");
    });
    it('should get all jobs from user', function () {
        scope.userId="citester";
        scope.getJobsByUserId(true);
        $httpBackend.expectGET('/proxy/pz-jobmanager.int.geointservices.io/job?order=desc&page=0&perPage=10&userName=citester');
        $httpBackend.flush();
        expect(scope.jobsList.length).toBe(1);
        expect(scope.total).toBe(1);
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