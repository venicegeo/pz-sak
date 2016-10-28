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

describe('Controller: AccessController', function () {

    var $httpBackend, dataRequestHandler,
        accessRequestHandler, loginHandler;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var AccessController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        dataRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/data?page=0&perPage=10').respond(
            {
                data: [
                    {
                        "dataId" : "4ad8487a-e11c-4be2-98a8-23873d95d360",
                        "dataType" : {
                            "type" : "raster",
                            "location" : {
                                "type" : "s3",
                                "bucketName" : "external-public-access-test",
                                "fileName" : "elevation.tif",
                                "domainName" : "s3.amazonaws.com"
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
                ],
                pagination: {
                    count: 1
                }
            }
        );
        accessRequestHandler = $httpBackend.when(
            'GET',
            '/proxy/pz-gateway.int.geointservices.io/data/4ad8487a-e11c-4be2-98a8-23873d95d360').respond(
            {
                "type" : "data",
                "data" : {
                    "dataId" : "4ad8487a-e11c-4be2-98a8-23873d95d360",
                    "dataType" : {
                        "type" : "raster",
                        "location" : {
                            "type" : "s3",
                            "bucketName" : "external-public-access-test",
                            "fileName" : "elevation.tif",
                            "domainName" : "s3.amazonaws.com"
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
            }
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        AccessController = $controller('AccessController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have page size default to 10', function () {
        $httpBackend.flush();
        expect(scope.pageSize).toBe(10);
    });

    it('should get a list of data objects', function () {
        scope.getData();
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/data?page=0&perPage=10');
        $httpBackend.flush();
        expect(scope.accessDataList.length).toBe(1);
        expect(scope.total).toBe(1);
    });

    it('should get one particular data object', function () {
        scope.dataId = "4ad8487a-e11c-4be2-98a8-23873d95d360";
        scope.getAccess();
        $httpBackend.expectGET('/proxy/pz-gateway.int.geointservices.io/data/4ad8487a-e11c-4be2-98a8-23873d95d360');
        $httpBackend.flush();
        expect(scope.accessData.dataId).toBe("4ad8487a-e11c-4be2-98a8-23873d95d360");
        expect(scope.accessData.dataType.type).toBe("raster");
        expect(scope.accessData.dataType.location.type).toBe("s3");
        expect(scope.accessData.metadata.description).toBe("This is a test.");
    });

});