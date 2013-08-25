define(['backbone', 'models/ScheduleItem'], function(Backbone, ScheduleItem){
    return Backbone.Collection.extend({
        url: '../api.php/schedules',
        model: ScheduleItem
    });
});

