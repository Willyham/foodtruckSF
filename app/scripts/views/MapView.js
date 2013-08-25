define([
    'backbone',
    'views/TruckView',
    'async!http://maps.google.com/maps/api/js?sensor=false'], function(Backbone, TruckView){
   return Backbone.View.extend({

       el: '#map',
       map: null,
       truckViews: [],

       options: {
           map: {
               zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP,
               center: new google.maps.LatLng(37.7833, -122.4167)
           }
       },

       initialize: function(){
           if(!this.collection){
               throw new Error('Map view requires a collection');
           }
           this.listenTo(this.collection, 'add', this.renderTruck);
       },

       render: function(){
           this.map = new google.maps.Map(this.el, this.options.map);
           return this;
       },

       renderTruck: function(truck){
            var truckView = new TruckView({
                model: truck,
                map: this.map
            });
           truckView.render();
       }

   })
});