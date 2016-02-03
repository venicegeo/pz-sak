(function () {
    'use strict';
    angular
        .module('SAKapp')
        .controller('IngesterController', ['$scope', '$http', '$log', '$q', IngesterController]);


    function IngesterController($scope, $http, $log, $q) {
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
                },
                error: function(res) {
                    $scope.errorMsg = res.status;
                    alert("Error " + res.status);
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
                url: "/proxy?url=http://pz-discover.cf.piazzageo.io/api/v1/resources/pz-gateway"
            }).then(function(result) {

                $http({
                    method: "GET",
                    url: "/proxy?url=http://" + result.data.address + "/jobStatus",
                }).then(function successCallback( html ) {
                    $scope.jobStatus = html.data;
                }, function errorCallback(response){
                    console.log("fail");
                    $scope.errorMsg2 = "There was an issue with your request.  Please make sure ..."
                });

            });
        }
    }
})();
