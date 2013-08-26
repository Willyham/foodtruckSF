define([
    'backbone',
    'views/TruckSearchItemView',
    'typeahead',
    'bootstrap'], function(Backbone, TruckSearchItemView){
    return Backbone.View.extend({

        className: 'truckSearch',
        typeAhead: null,

        initialize: function(){
            if(!this.collection){
                throw new Error('TruckView requires a Trucks collection');
            }
            this.typeAhead = new Backbone.Typeahead({
                collection: this.collection,
                keys: ['Applicant', 'FoodItems'],
                view: TruckSearchItemView
            });
            this.typeAhead.on('selected', function(truck){
                truck.collection.forEach(function(otherTrucks){
                    otherTrucks.set('selected', false);
                });
                truck.set('selected', true);
            });
            this.$el.popover({
                trigger: 'hover',
                container: '#truckSearchContainer',
                content: 'test'

            });
        },

        render: function(){
            if(this.typeAhead){
                return this.$el.html(this.typeAhead.render().el);
            }
            return this.$el.html();
        }
    })
});