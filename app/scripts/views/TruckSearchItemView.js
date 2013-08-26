define([
    'backbone','typeahead'], function(Backbone){
    return Backbone.View.extend({

        className: 'truckSearchItemView',
        divName: 'li',
        template: _.template('<span class="truckName"><%- applicant %></span><span class="truckAddress"><%- address %></span><br/><div class="truckFood"><%- foodItems %></div>'),

        events: {
            'click': 'selectItem',
            'mouseover truckFood': 'activateItem'
        },

        initialize: function(options){
            if(!this.model){
                throw new Error('TruckSearchItemView requires a Truck model');
            }
            this.parent = options.parent;
        },

        render: function(){
            var foodItems = _.reject( this.model.get('FoodItems').split(':'), function(item){
                return item.toLowerCase().match(/cold truck\.?/);
            });
            this.$el.html(this.template({
                applicant: this.model.get('Applicant'),
                address: this.model.get('Address'),
                foodItems: foodItems
            }));
            return this;
        },

        selectItem: function() {
            this.parent.selectModel(this.model);
        },
        activateItem: function() {
            this.parent.activateModel(this.model);
        }
    })
});
