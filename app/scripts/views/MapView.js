define([
    'backbone',
    'views/TruckView',
    'clusterer',
    'async!http://maps.google.com/maps/api/js?sensor=false'], function(Backbone, TruckView, MarkerClusterer){
   return Backbone.View.extend({

       el: '#map',
       map: null,
       clusterer: null,
       truckViews: {},

       options: {
           map: {
               zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP,
               center: new google.maps.LatLng(37.7833, -122.4167),
               disableDefaultUI: true,
               mapTypeControl: true
           }
       },

       initialize: function(){
           if(!this.collection){
               throw new Error('Map view requires a collection');
           }
           this.listenTo(this.collection, 'add', this.renderTruck);
           this.listenTo(this.collection, 'reset', this.renderTrucks);
           this.listenTo(this.collection, 'change:selected', this.selectTruck);
       },

       render: function(){
           this.map = new google.maps.Map(this.el, this.options.map);
           this.clusterer = new MarkerClusterer(this.map, [], {
               maxZoom: 18
           });
           return this;
       },

       renderTrucks: function(){
           this.clusterer.clearMarkers();
           _.each(this.truckViews, function(truckView){
                truckView.destroy();
           });
           this.truckViews = {};
           this.collection.forEach(_.bind(this.renderTruck, this));
       },

       renderTruck: function(truck){
           var truckView = new TruckView({
               model: truck,
               map: this.map
           });
           this.truckViews[truck.id] = truckView;
           this.clusterer.addMarker(truckView.getMarker());
       },

       selectTruck: function(truck){
           if(truck.get('selected')){
               this.zoomToTruck(truck);
               this.showDetails(truck);
           }
           else{
               this.hideDetails(truck);
           }
       },

       zoomToTruck: function(truck){
           var truckView = this.truckViews[truck.id];
           var marker = truckView.getMarker();
           this.map.setZoom(18);
           this.map.panTo(marker.position);
       },

       showDetails: function(truck){
           var truckView = this.truckViews[truck.id];
           truckView.showDetails();
       },

       hideDetails: function(truck){
           var truckView = this.truckViews[truck.id];
           truckView.hideDetails();
       }
   })
});