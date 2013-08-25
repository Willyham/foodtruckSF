define([
    'backbone',
    'typeahead'], function(Backbone){
    return Backbone.View.extend({

        className: 'truckSearch',
        typeAhead: null,

        initialize: function(){
            if(!this.collection){
                throw new Error('TruckView requires a Trucks collection');
            }
            this.typeAhead = new Backbone.Typeahead({
                collection: this.collection,
                keys: ['Applicant', 'FoodItems']
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