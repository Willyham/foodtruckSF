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
        },
        clusterer: {
            exports: 'MarkerClusterer'
        },
        typeahead: {
            deps: ['backbone'],
            exports: 'TypeAhead'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        async: '../bower_components/requirejs-plugins/src/async',
        clusterer: 'vendor/clusterer/markerclusterer',
        typeahead: 'vendor/backbone.typeahead/backbone.typeahead'
    }
});

require([
    'backbone',
    'collections/Trucks',
    'views/MapView',
    'views/TruckSearchView'
], function (Backbone, Trucks, MapView, TruckSearchView) {

    var trucksCollection = new Trucks();


    trucksCollection.fetch().done(function(){

        var mapView = new MapView({
            collection: trucksCollection
        });
        mapView.render();

        var currentTrucks = trucksCollection.filter(function(truck){
            return truck.get('Status') == 'APPROVED';
        });

        var upcomingTrucks = trucksCollection.filter(function(truck){
            return truck.get('Status') == 'REQUESTED' && new Date() < new Date(truck.get('ExpirationDate'));
        });

        trucksCollection.reset(currentTrucks);

        var truckSearchView = new TruckSearchView({
            collection: trucksCollection
        });
        $('#truckSearchContainer').html(truckSearchView.render());
    });

    Backbone.history.start();
});
