define([
    'backbone',
    'views/TruckDetailsView',
    'async!http://maps.google.com/maps/api/js?sensor=false'], function(Backbone, TruckDetailsView){
    return Backbone.View.extend({

        marker: null,
        detailsView: null,

        /**
         * Create a new marker for this truck, but don't show it yet.
         * Setup a click handler to let the user select a truck by clicking it.
         */
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

            google.maps.event.addListener(this.marker, 'click', _.bind(this._onSelectChange,this));
        },

        /**
         * Return the truck's marker.
         * @returns {google.maps.Marker} The truck's marker.
         */
        getMarker: function(){
            return this.marker;
        },

        /**
         * When the user clicks a truck, ensure this is the only one set as selected
         * @private
         */
        _onSelectChange: function(){
            this.model.collection.forEach(function(truck){
                truck.set('selected', false);
            });
            this.model.set('selected', true);
        },

        /**
         * Show details for the truck, lazy loading the details view.
         */
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

        /**
         * Hide the details for the truck
         */
        hideDetails: function(){
            if(this.detailsView){
                this.detailsView.close();
            }
        },

        /**
         * Remove the truck from the map.
         * Clean up the details too.
         */
        destroy: function(){
            if(this.detailsView){
                this.detailsView.destroy();
            }
            this.marker.setMap(null);
            this.marker = null;
            this.remove();
        }
    })
});