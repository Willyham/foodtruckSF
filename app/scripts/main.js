/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        async: '../bower_components/requirejs-plugins/src/async'
    }
});

require([
    'backbone',
    'collections/Trucks',
    'views/MapView'
], function (Backbone, Trucks, MapView ) {

    var trucksCollection = new Trucks();
    var mapView = new MapView({
        collection: trucksCollection
    });
    mapView.render();

    trucksCollection.fetch().done(function(){

    });

    Backbone.history.start();
});
