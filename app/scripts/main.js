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
        bootstrap: 'vendor/bootstrap'
    }
});

require([
    'backbone',
    'collections/Trucks'
], function (Backbone, Trucks) {

    var trucksCollection = new Trucks();
    trucksCollection.fetch().done(function(){
        debugger;
        var truck = trucksCollection.first();
        console.log(truck);
        printSchedule(truck.schedule);

        truck.fetch().done(function(){
            printSchedule(truck.schedule);
        });

    });

    function printSchedule(s){
        s.forEach(function(a){
            console.log(a);
        })
    }

    Backbone.history.start();
});
