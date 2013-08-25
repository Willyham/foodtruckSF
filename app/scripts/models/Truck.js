define(['backbone', 'collections/Schedule'], function(Backbone, Schedule){
    return Backbone.Model.extend({
        idAttribute: "_id",

        constructor: function() {
            // Create a schedule collection for each truck.
            this.schedule = new Schedule();
            Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        initialize: function(attributes, options) {
            this.scheduleChanged();
            this.on('change:schedule', this.scheduleChanged, this);
        },

        // Proxy changes to 'schedule' attribute into the collection
        scheduleChanged: function(){
            var schedule = this.get('schedule');
            if(schedule){
                this.schedule.set(schedule);
                this.unset('schedule');
            }
        }

    });
});
