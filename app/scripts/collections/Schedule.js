define(['backbone', 'models/Schedule'], function(Backbone, Schedule){
    return Backbone.Collection.extend({
        url: '../api.php/schedules',
        model: Schedule
    });
});

