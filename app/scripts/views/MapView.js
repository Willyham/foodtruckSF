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

       /**
        * Initialise the view by listening for changes on the collection.
        * When a truck is added, render it.
        * When the collection is reset, blow everything away and redraw.
        * When a truck is selected, show it and show the schedule details
        */
       initialize: function(){
           if(!this.collection){
               throw new Error('Map view requires a collection');
           }
           this.listenTo(this.collection, 'add', this._renderTruck);
           this.listenTo(this.collection, 'reset', this._resetTrucks);
           this.listenTo(this.collection, 'change:selected', this._onSelectChange);
       },

       /**
        * Render the view.
        * Use a clustering algorithm so we don't display too many markers at once
        */
       render: function(){
           this.map = new google.maps.Map(this.el, this.options.map);
           this.clusterer = new MarkerClusterer(this.map, [], {
               maxZoom: 18
           });
       },

       /**
        * Reset trucks from the collection.
        * Destroy all current views, blow away the cache, then redraw.
        * @private
        */
       _resetTrucks: function(){
           this.clusterer.clearMarkers();
           _.each(this.truckViews, function(truckView){
                truckView.destroy();
           });
           this.truckViews = {};
           this.collection.forEach(_.bind(this._renderTruck, this));
       },

       /**
        * Draw an individual truck by creating a view and then adding
        * its marker to the map
        * @param {Truck} truck
        * @private
        */
       _renderTruck: function(truck){
           var truckView = new TruckView({
               model: truck,
               map: this.map
           });
           this.truckViews[truck.id] = truckView;
           this.clusterer.addMarker(truckView.getMarker());
       },

       /**
        * When a truck's select flag changes, either show the truck or hide the details
        * @param {Truck} truck
        * @private
        */
       _onSelectChange: function(truck){
           if(truck.get('selected')){
               this.zoomToTruck(truck);
               this.showDetails(truck);
           }
           else{
               this.hideDetails(truck);
           }
       },

       /**
        * Zoom + move to a specific truck
        * @param {Truck} truck
        */
       zoomToTruck: function(truck){
           var truckView = this.truckViews[truck.id];
           var marker = truckView.getMarker();
           this.map.setZoom(18);
           this.map.panTo(marker.position);
       },

       /**
        * Show the details for a truck
        * @param {Truck} truck
        */
       showDetails: function(truck){
           var truckView = this.truckViews[truck.id];
           truckView.showDetails();
       },

       /**
        * Hide the details for a truck
        * @param {Truck} truck
        */
       hideDetails: function(truck){
           var truckView = this.truckViews[truck.id];
           truckView.hideDetails();
       }
   })
});