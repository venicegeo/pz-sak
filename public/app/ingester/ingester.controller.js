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
                apiKey: "some auth key",
                jobType: {
                    type: "ingest",
                    data: {
                        // Maybe the file goes in here (ResourceMetadata - fill out as much as possible)
                        key : "value",
                        //file: f
                    }
                }
            };

            // TODO: Either include the JSON in the url as a param or include it in the form data
            var fd = new FormData();
            fd.append( 'data', ingestObj );
            fd.append( 'file', f );

            $.ajax({
                url: '/proxy?url=someURLToBeDeterminedLater',
                data: fd,
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
            $scope.jobId = "39492023940958201209348";
        }

        $scope.getJobStatus = function() {
            $http({
                method: "GET",
                url: "/proxy?url=pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=" + result.data.address + "/jobStatus",
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
