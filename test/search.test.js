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

describe('Controller: SearchController', function () {

    var $httpBackend,
        getResultsCountHandler,
        getSearchResultsHandler,
        getDocHandler,
        putDocHandler,
        loginHandler;
        // $cookies;

    // load the controller's module
    beforeEach(module('SAKapp'));

    var SearchController,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        // $cookies = $injector.get('$cookies');
        // $cookies.putObject('auth', '{isLoggedIn:true}');
        $httpBackend = $injector.get('$httpBackend');
        getResultsCountHandler = $httpBackend.when(
            'POST',
            '/proxy/pz-search-query.int.geointservices.io/api/v1/recordcount',
            {
                "match_all": {}
            }
        ).respond(
            "114904"
        );
        getSearchResultsHandler = $httpBackend.when(
            'POST',
            '/proxy/pz-gateway.int.geointservices.io/data/query',
            {
                "query": {"match_all": {}},
                "size" : 1,
                "from" : 0
            }
        ).respond(
            {
                "type": "data-list",
                "data": [
                    {
                        "dataId": "a02cfb35-15cb-4c3c-8192-90e385e1d0d5",
                        "dataType": {
                            "type": "raster",
                            "location": {
                                "type": "s3",
                                "bucketName": "external-public-access-test",
                                "fileName": "elevation.tif",
                                "fileSize": 90074,
                                "domainName": "s3.amazonaws.com"
                            },
                            "mimeType": null
                        },
                        "spatialMetadata": {
                            "coordinateReferenceSystem": "PROJCS[\"WGS 84 / UTM zone 32N\", \n  GEOGCS[\"WGS 84\", \n    DATUM[\"World Geodetic System 1984\", \n      SPHEROID[\"WGS 84\", 6378137.0, 298.257223563, AUTHORITY[\"EPSG\",\"7030\"]], \n      AUTHORITY[\"EPSG\",\"6326\"]], \n    PRIMEM[\"Greenwich\", 0.0, AUTHORITY[\"EPSG\",\"8901\"]], \n    UNIT[\"degree\", 0.017453292519943295], \n    AXIS[\"Geodetic latitude\", NORTH], \n    AXIS[\"Geodetic longitude\", EAST], \n    AUTHORITY[\"EPSG\",\"4326\"]], \n  PROJECTION[\"Transverse_Mercator\", AUTHORITY[\"EPSG\",\"9807\"]], \n  PARAMETER[\"central_meridian\", 9.0], \n  PARAMETER[\"latitude_of_origin\", 0.0], \n  PARAMETER[\"scale_factor\", 0.9996], \n  PARAMETER[\"false_easting\", 500000.0], \n  PARAMETER[\"false_northing\", 0.0], \n  UNIT[\"m\", 1.0], \n  AXIS[\"Easting\", EAST], \n  AXIS[\"Northing\", NORTH], \n  AUTHORITY[\"EPSG\",\"32632\"]]",
                            "epsgCode": 32632,
                            "minX": 496147.97,
                            "minY": 5422119.88,
                            "maxX": 496545.97,
                            "maxY": 5422343.88,
                            "projectedSpatialMetadata": {
                                "epsgCode": 4326,
                                "minX": 48.951988079329226,
                                "minY": 8.947383721057443,
                                "maxX": 48.95400546464395,
                                "maxY": 8.952822045838397
                            }
                        },
                        "metadata": {
                            "name": "My Test raster external file",
                            "description": "This is a test.",
                            "format": null,
                            "qos": null,
                            "statusType": null,
                            "availability": null,
                            "tags": null,
                            "classType": {
                                "classification": "unclassified"
                            },
                            "clientCertRequired": null,
                            "credentialsRequired": null,
                            "preAuthRequired": null,
                            "networkAvailable": null,
                            "contacts": null,
                            "reason": null,
                            "version": null,
                            "createdBy": "citester",
                            "createdOn": "2016-10-07T19:05:04.562Z",
                            "createdByJobId": "4de54a37-0acd-495e-868c-d767e7c4d484",
                            "metadata": null,
                            "numericKeyValueList": null,
                            "textKeyValueList": null
                        }
                    }
                ]
            }
        );
        getDocHandler = $httpBackend.when(
            'GET',
            '/proxy?url=pz-search-query.int.geointservices.io/indexID/typeID/documentID'
        ).respond(
            {
                "_source": {}
            }
        );
        putDocHandler = $httpBackend.when(
            'POST',
            '/proxy?url=pz-search-query.int.geointservices.io/indexID/typeID/documentID/_update',
            {
                "doc": {
                    "keywords": ["tag1"]
                }
            }
        ).respond(
            {}
        );
        loginHandler = $httpBackend.when(
            'GET',
            '/login.html').respond({});
        SearchController = $controller('SearchController', {
            $scope: scope
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get the number of results', function () {
        scope.getResultsCount(
            {
                "match_all": {}
            }
        );
        $httpBackend.expectPOST('/proxy/pz-search-query.int.geointservices.io/api/v1/recordcount',
            {
                "match_all": {}
            }
        );
        $httpBackend.flush();
        expect(scope.actualResultsCount).toBe("114904");
        expect(scope.totalResults).toBe(10000);
    });
    it('should get the search results', function () {
        scope.pagination.current = 0;
        scope.size = 1;
        scope.getSearchResults();
        $httpBackend.expectPOST('/proxy/pz-gateway.int.geointservices.io/data/query',
        {
            "query": {"match_all": {}},
            "size": 1,
            "from": 0
        });
        $httpBackend.flush();
        expect(scope.searchResults[0].dataId).toBe("a02cfb35-15cb-4c3c-8192-90e385e1d0d5");
    });
    it('should get the pageChange', function () {
        scope.size = 1;
        scope.pageChanged(1);
        $httpBackend.expectPOST('/proxy/pz-gateway.int.geointservices.io/data/query',
        {
            "query": {"match_all": {}},
            "size": 1,
            "from": 0
        });
        $httpBackend.flush();
        expect(scope.searchResults[0].dataId).toBe("a02cfb35-15cb-4c3c-8192-90e385e1d0d5");
    });

    it('should add tag', function () {
        scope.indexId = "indexID";
        scope.typeId = "typeID";
        scope.documentId = "documentID";
        scope.tag = "tag1";
        scope.addTags();
        $httpBackend.expectGET('/proxy?url=pz-search-query.int.geointservices.io/indexID/typeID/documentID');
        $httpBackend.expectPOST('/proxy?url=pz-search-query.int.geointservices.io/indexID/typeID/documentID/_update',
            {
                "doc": {
                    "keywords": ["tag1"]
                }
            });
        $httpBackend.flush();
        expect(scope.tagMsg).toBe("Keyword added successfully");
    });

});