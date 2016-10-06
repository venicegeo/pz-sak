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

describe('Controller: UserServiceController', function () {

    var $httpBackend;
    var executeResultRequestHandler,
        executeServiceHandler,
        resourceDataHandler,
        describeRequestHandler,
        registerServiceHandler,
        getServicesHandler,
        searchServicesHandler,
        updateServiceHandler,
        deleteServiceHandler,
        loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var UserServiceController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');

        describeRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/service/aaa')
            .respond({
                "type" : "service",
                "service" : {
                    "serviceId" : "aaa",
                    "url" : "http://pzsvc-hello.int.geointservices.io/",
                    "contractUrl" : "http://pzsvc-hello.int.geointservices.io/",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "Hello World Test",
                        "description" : "Hello world test"
                    }
                }
            });
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
        registerServiceHandler = $httpBackend.when(
            'POST',
            '/proxy/pz-gateway.int.geointservices.io/service',
            {
                "url" : "http://pzsvc-hello.int.geointservices.io/",
                "contractUrl" : "http://pzsvc-hello.int.geointservices.io/",
                "method" : "GET",
                "resourceMetadata" : {
                    "name" : "Hello World Test",
                    "description" : "Hello world test",
                    "classType": ""
                }
            })
            .respond({
                "type": "service",
                "data": {
                    "serviceId": "aaa"
                }
            });
        executeServiceHandler = $httpBackend.when(
            'POST',
            '/proxy/pz-gateway.int.geointservices.io/job',
            {
                "type":"execute-service",
                "data":{
                    "serviceId":
                    "aaa",
                        "dataInputs": {},
                    "dataOutput": [ {  "mimeType":"application/json", "type":"text"}]
                }
            })
            .respond({
                    "type": "job",
                    "jobId": "bbb"
                }
            );
        getServicesHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/service?page=0&perPage=25')
            .respond({
                "type" : "service-list",
                "data" : [ {
                    "serviceId" : "8c7706ab-a541-4914-b68b-d881448a7485",
                    "url" : "https://pzsvc-ossim.int.geointservices.io/execute",
                    "method" : "POST",
                    "resourceMetadata" : {
                        "name" : "pzsvc-ossim",
                        "description" : "The OSSIM shoreline-detection algorithm, served via piazza"
                    }
                }, {
                    "serviceId" : "42ad2fe7-94bb-42f6-bf09-1540abf69492",
                    "method" : "POST",
                    "resourceMetadata" : {
                        "name" : "pz-svcs-prevgen_test",
                        "description" : "Service that takes payload containing S3 location and bounding box for some raster file, downloads, crops and uploads the crop back up to s3."
                    }
                }, {
                    "serviceId" : "4166b752-fc89-45ad-bf30-0933cc769c8b",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "GetLocations Test",
                        "description" : "Returns a location"
                    }
                }, {
                    "serviceId" : "d692fabb-6b98-427b-925d-f72c7fd34d3a",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "GetLocations Test",
                        "description" : "Returns a location"
                    }
                }, {
                    "serviceId" : "2ea09b87-a048-4dd1-a185-4fdbbf75c3a5",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "GetLocations Test",
                        "description" : "Returns a location"
                    }
                }, {
                    "serviceId" : "f35c33f1-4c8f-4c7f-a163-2a0c79fafd72",
                    "url" : "https://pz-servicecontroller.int.geointservices.io/jumpstart/string/toUpper",
                    "method" : "POST",
                    "resourceMetadata" : {
                        "name" : "toUpper Params Cat and Parrot",
                        "description" : "Service to convert string to uppercase"
                    }
                }, {
                    "serviceId" : "a0cec3f6-0514-4563-b72d-3c2765e94a9d"
                }, {
                    "serviceId" : "9a81387a-55a0-4757-8137-f904046916d5",
                    "url" : "NOT ACTUALLY A SERVICE/execute",
                    "method" : "POST",
                    "resourceMetadata" : {
                        "name" : "pzsvc-exec test",
                        "description" : "The command line, served via piazza - now edited!",
                        "classType" : {
                            "classification" : "UNCLASSIFIED"
                        },
                        "version" : "0.0",
                        "metadata" : {
                            "FavColor" : "Blue",
                            "Interface" : "pzsvc-exec/exec",
                            "MaxSize" : "2G",
                            "imgReq - Bands" : "3,6",
                            "imgReq - cloudCover" : "10%"
                        }
                    }
                }, {
                    "serviceId" : "9bcddf60-d568-49b9-a64c-6c0f092aabaf"
                }, {
                    "serviceId" : "d147ffb1-b36f-4b0b-8134-0613cb183c31"
                } ],
                "pagination" : {
                    "count" : 40,
                    "page" : 0,
                    "perPage" : 10
                }
            });
        searchServicesHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/service?keyword=test&page=0&perPage=25')
            .respond({
                "type" : "service-list",
                "data" : [ {
                    "serviceId" : "42ad2fe7-94bb-42f6-bf09-1540abf69492",
                    "method" : "POST",
                    "resourceMetadata" : {
                        "name" : "pz-svcs-prevgen_test",
                        "description" : "Service that takes payload containing S3 location and bounding box for some raster file, downloads, crops and uploads the crop back up to s3."
                    }
                }, {
                    "serviceId" : "4166b752-fc89-45ad-bf30-0933cc769c8b",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "GetLocations Test",
                        "description" : "Returns a location"
                    }
                }, {
                    "serviceId" : "d692fabb-6b98-427b-925d-f72c7fd34d3a",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "GetLocations Test",
                        "description" : "Returns a location"
                    }
                }, {
                    "serviceId" : "2ea09b87-a048-4dd1-a185-4fdbbf75c3a5",
                    "method" : "GET",
                    "resourceMetadata" : {
                        "name" : "GetLocations Test",
                        "description" : "Returns a location"
                    }
                }, {
                    "serviceId" : "9a81387a-55a0-4757-8137-f904046916d5",
                    "url" : "NOT ACTUALLY A SERVICE/execute",
                    "method" : "POST",
                    "resourceMetadata" : {
                        "name" : "pzsvc-exec test",
                        "description" : "The command line, served via piazza - now edited!",
                        "classType" : {
                            "classification" : "UNCLASSIFIED"
                        },
                        "version" : "0.0",
                        "metadata" : {
                            "FavColor" : "Blue",
                            "Interface" : "pzsvc-exec/exec",
                            "MaxSize" : "2G",
                            "imgReq - Bands" : "3,6",
                            "imgReq - cloudCover" : "10%"
                        }
                    }
                }],
                "pagination" : {
                    "count" : 21,
                    "page" : 0,
                    "perPage" : 5
                }
            });
        updateServiceHandler = $httpBackend.when(
            'PUT',
            '/proxy/pz-gateway.int.geointservices.io/service/aaa')
            .respond(200);
        deleteServiceHandler = $httpBackend.when(
            'DELETE',
            '/proxy/pz-gateway.int.geointservices.io/service/aaa')
            .respond(200);
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        UserServiceController = $controller('UserServiceController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get list of all services', function () {
        scope.getServices(1);
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/service?page=0&perPage=25');
        $httpBackend.flush();
        expect(scope.services.length).toBe(10);
        expect(scope.totalServices).toBe(40);
    });
    it('should search services', function () {
        scope.searchField="test";
        scope.searchPerPage=25;
        scope.searchServices(1);
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/service?keyword=test&page=0&perPage=25');
        $httpBackend.flush();
        expect(scope.results.length).toBe(5);
        expect(scope.totalSearchResults).toBe(21);
    });
    it('should register a service', function () {
        scope.serviceUrl="http://pzsvc-hello.int.geointservices.io/";
        scope.serviceName="Hello World Test";
        scope.serviceDescription="Hello world test";
        scope.method="GET";
        scope.registerService();
        $httpBackend.expectPOST('/proxy/pz-gateway.int.geointservices.io/service',
        {
            "url" : "http://pzsvc-hello.int.geointservices.io/",
            "contractUrl" : "http://pzsvc-hello.int.geointservices.io/",
            "method" : "GET",
            "resourceMetadata" : {
                "name" : "Hello World Test",
                "description" : "Hello world test",
                "classType": ""
            }
        });
        $httpBackend.flush();
        expect(scope.registrationSuccess).toBe("aaa");
    });
    it('should describe a service', function () {
        scope.serviceId = "aaa";
        scope.describeService();
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/service/aaa');
        $httpBackend.flush();
        expect(scope.describeUrl).toBe("http://pzsvc-hello.int.geointservices.io/");
        expect(scope.describeMetadata.name).toBe("Hello World Test");
    });
    it('should update a service', function () {
        scope.updateResourceId="aaa";
        scope.updateService();
        $httpBackend.expectPUT('/proxy/pz-gateway.int.geointservices.io/service/aaa');
        $httpBackend.expect(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/service?page=0&perPage=25');
        $httpBackend.flush();
        expect(scope.services.length).toBe(10);
        expect(scope.totalServices).toBe(40);
    });
    it('should delete a service', function () {
        scope.deleteService("aaa");
        $httpBackend.expect(
            'DELETE',
            '/proxy/pz-gateway.int.geointservices.io/service/aaa');
        $httpBackend.expect(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/service?page=0&perPage=25');
        $httpBackend.flush();
        expect(scope.services.length).toBe(10);
        expect(scope.totalServices).toBe(40);
    });

});