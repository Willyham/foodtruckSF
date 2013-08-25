define([
    'backbone',
    'async!http://maps.google.com/maps/api/js?sensor=false'], function(Backbone){
    return Backbone.View.extend({

        marker: null,

        initialize: function(){
            if(!this.options.map){
                throw new Error('TruckView requires a map');
            }
            if(!this.model){
                throw new Error('TruckView requires a Truck model');
            }

            this.marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.model.get('Latitude'), this.model.get('Longitude')),
                title: this.model.get('Applicant'),
                id : this.model.get('id')
            });
        },

        getMarker: function(){
            return this.marker;
        }
    })
});