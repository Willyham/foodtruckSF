define([
    'backbone',
    'views/TruckDetailsView',
    'async!http://maps.google.com/maps/api/js?sensor=false'], function(Backbone, TruckDetailsView){
    return Backbone.View.extend({

        marker: null,
        detailsView: null,

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

            google.maps.event.addListener(this.marker, 'click', _.bind(this.selectTruck,this));
        },

        getMarker: function(){
            return this.marker;
        },

        selectTruck: function(){
            this.model.collection.forEach(function(truck){
                truck.set('selected', false);
            });
            this.model.set('selected', true);
        },

        showDetails: function(){
            if(!this.detailsView){
                this.detailsView = new TruckDetailsView({
                    map: this.options.map,
                    marker: this.marker,
                    model: this.model
                });
            }
            this.detailsView.open();
        },

        hideDetails: function(){
            if(this.detailsView){
                this.detailsView.close();
            }
        }
    })
});