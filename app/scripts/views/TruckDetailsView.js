define([
    'backbone'], function(Backbone){
    return Backbone.View.extend({

        scheduleTemplate: _.template('<h3><%- name %></h3><%= scheduleList %>'),
        scheduleItemTemplate: _.template('<strong><%- day %></strong> from <%- from %> until <%- to %><br/>'),

        initialize: function(){
            if(!this.options.map){
                throw new Error('TruckDetailsView requires a map');
            }
            if(!this.options.marker){
                throw new Error('TruckDetailsView requires a marker');
            }
            if(!this.model){
                throw new Error('TruckDetailsView requires a Truck model');
            }

            this.infoWindow = new google.maps.InfoWindow({
                content: 'Loading...'
            });

            // Lazy load the schedules for this truck
            this.model.fetch().done(_.bind(this.displaySchedule, this));

        },

        displaySchedule: function(){
            var self = this;
            var sortedModels = this.model.schedule.sortBy(function(schedule){
                return schedule.get('DayOrder');
            });
            var scheduleText = _.reduce(sortedModels, function(memo, schedule){
                return memo + self.scheduleItemTemplate({
                    day: schedule.get('DayOfWeekStr'),
                    from: schedule.get('starttime'),
                    to: schedule.get('endtime')
                });
            }, '');

            var schedule = this.scheduleTemplate({
                name: this.model.get('Applicant'),
                scheduleList: scheduleText
            });

            this.infoWindow.setContent(schedule);
        },

        open: function(){
            this.infoWindow.open(this.options.map, this.options.marker);
        },

        close: function(){
            this.infoWindow.close();
        },

        destroy: function(){
            this.close();
            this.infowWindow = null;
            this.remove();
        }
    })
});