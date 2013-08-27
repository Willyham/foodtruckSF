define([
    'backbone','typeahead'], function(Backbone){
    return Backbone.View.extend({

        className: 'truckSearchItemView',
        divName: 'li',
        template: _.template('<span class="truckName text-overflow"><%- applicant %></span><span class="truckAddress"><%- address %></span><br/><div class="truckFood text-overflow"><%- foodItems %></div>'),

        events: {
            'click': 'selectItem',
            'mouseover': 'activateItem',
            'mouseout': 'deactivateItem'
        },

        initialize: function(options){
            if(!this.model){
                throw new Error('TruckSearchItemView requires a Truck model');
            }
            this.parent = options.parent;
        },

        /**
         * Render each item in the list.
         * Remove all of the instances of 'cold truck' which isn't really a food item.
         * @returns {TruckSearchItemView} this
         */
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

        /**
         * Select the model when a user clicks.
         * Unfortunately, this is the way the type ahead plugin expects the selecting to work.
         */
        selectItem: function() {
            this.parent.selectModel(this.model);
        },

        /**
         * Add an 'active' class on hover
         */
        activateItem: function(){
            this.$el.children('.truckAddress').addClass('active');
        },

        /**
         * Remove the 'active' class on hover
         */
        deactivateItem: function(){
            this.$el.children('.truckAddress').removeClass('active');
        }
    })
});
