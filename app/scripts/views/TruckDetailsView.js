define([
    'backbone'], function(Backbone){
    return Backbone.View.extend({

        initialize: function(){
            if(!this.options.map){
                throw new Error('TruckDetailsView requires a map');
            }
            if(!this.options.marker){
                throw new Error('TruckDetailsView requires a marker');
            }
            if(!this.model){
                throw new Error('TruckDetailsView requires a Truck model');
            }

            this.infoWindow = new google.maps.InfoWindow({
                content: 'test'
            });
        },

        open: function(){
            this.infoWindow.open(this.options.map, this.options.marker);
        },

        close: function(){
            this.infoWindow.close();
        }
    })
});