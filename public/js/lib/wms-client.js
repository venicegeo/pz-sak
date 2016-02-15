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
//= require jquery.js
//= require OpenLayersLite-formats.js
//= require_self

'use strict';
OGC.WMS = OGC.WMS || {};

OGC.WMS.Client = OpenLayers.Class({
    initialize: function ( wmsServer, version ){
        this.wmsServer = wmsServer;
        this.version = version; 
    },
    getLayers: function (cb){
        var localLayers = [];
        var isAsync = (cb instanceof Function);

        // TODO: Step through this and see if we actually need this
        if ( this.wmsLocalLayers === undefined ){
            var formatter = new ol.format.WMSCapabilities();
            var that = this;

            var params = {
                service: 'WMS',
                version: this.version,
                request: 'GetCapabilities'
            };

            OpenLayers.Request.GET( {
                url: this.wmsServer,
                async: isAsync,
                params: params,
               /* headers: {
                	"Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "origin, content-type, accept"
                },*/
                success: function ( request )
                {
                    console.log('request########', request)
                    var doc = request.responseXML;
                    if ( !doc || !doc.documentElement )
                    {
                        doc = request.responseText;
                    }

                    // use the tool to parse the data
                    var response = (formatter.read( doc ));

                    for ( var i = 0; i < response.Capability.Layer.Layer.length; i++ )
                    {
                        var layer = response.Capability.Layer.Layer[i];

                        console.log( 'layer', layer );

                        localLayers.push( layer );

                        console.log(formatter);

                    }
                }
            } );
            that.localLayers = localLayers;

        }
        else
        {

            //console.log( 'cached...' );

        }

        if ( isAsync )
        {
            //console.log( 'We are ASync!' );
            cb( this.localLayers );
        }
        //console.log( isAsync );

        return this.localLayers;
    },
    CLASS_NAME: "OGC.WMS.Client"
} );

