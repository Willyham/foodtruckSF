define(['backbone', 'collections/Schedule'], function(Backbone, Schedule){
    return Backbone.Model.extend({
        idAttribute: "_id",

        constructor: function() {
            // Create a schedule collection for each truck.
            this.schedule = new Schedule();
            Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        initialize: function(attributes, options) {
            this.on('change:schedule', this.scheduleChanged, this);
        },

        // Proxy changes to 'schedule' attribute into the collection
        scheduleChanged: function(){
            var schedule = this.get('schedule');
            if(schedule){
                this.schedule.set(schedule);
                this.unset('schedule');
            }
        },

        /**
         * Parse the API response for a truck.
         * If it's wrapped in an API response, extract the data,
         * otherwise load as normal.
         * We need this because when a model is created via the collection, each one isn't wrapped in an API response
         * @param response
         * @returns {*}
         */
        parse: function(response){
            if(response.result && response.data){
                return response.data;
            }
            return response;
        }

    });
});
