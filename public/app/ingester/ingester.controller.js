/*
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
(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('IngesterController', ['$scope', '$http', '$log', '$q', 'toaster', IngesterController]);


    function IngesterController($scope, $http, $log, $q, toaster) {
        $scope.data = "none";

        $scope.ingest = function () {
            var f = document.getElementById('file').files[0],
                r = new FileReader();
            r.onloadend = function (e) {
                $scope.data = e.target.result;
            }
            r.readAsBinaryString(f);


            var ingestObj = {
                "apiKey": "my-api-key-929304",
                "jobType": {
                    "type": "ingest",
                    "host": "true",
                    "data" : {
                        "dataType": {
                            "type": "text",
                            "mimeType": "application/text",
                            "content": "This text itself is the raw data to be ingested. In reality, it could be some GML, or GeoJSON, or whatever."
                        },
                        "metadata": {
                            "name": "Testing some Text Input",
                            "description": "This is a test.",
                            "classType": "unclassified"
                        }
                    }
                }
            };

            // TODO: Either include the JSON in the url as a param or include it in the form data
            var fd = new FormData();
            fd.append( 'data', ingestObj );
            fd.append( 'file', f );

            $.ajax({
                url: '/proxy?url=pz-gateway.cf.piazzageo.io/job',
                data: ingestObj,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function(data){
                    $scope.jobId = data.jobId;
                    alert(data);
                    toaster.pop('success', "Success", "Ingest was a success");
                },
                error: function(res) {
                    //$scope.errorMsg = res.status;
                    console.log("ingester.controller fail"+res.status);
                    toaster.pop('error', "Error", "There was an error with file ingest.");
                    //alert("Error " + res.status);
                }
            });
            /*$.post("urlToCome", function () {
                    alert("success");
                })
                .done(function () {
                    alert("second success");
                })
                .fail(function () {
                    alert("error");
                })
                .always(function () {
                    alert("finished");
                });*/
           // $scope.jobId = "39492023940958201209348";
        }

        $scope.getJobStatus = function() {
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.host + "/job",
                }).then(function successCallback( html ) {
                    $scope.jobStatus = html.data;
                }, function errorCallback(response){
                    console.log("Ingester.controller fail"+response.status);
                    toaster.pop('error', "Error", "There was an issue with your request.");
                });

            });
        }
    }
})();
