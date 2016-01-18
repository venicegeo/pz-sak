/**
 * Created by jmcmahon on 1/12/16.
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

