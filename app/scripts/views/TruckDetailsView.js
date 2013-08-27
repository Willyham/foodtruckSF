define([
    'backbone'], function(Backbone){
    return Backbone.View.extend({

        scheduleTemplate: _.template('<h4 class="truckName"><%- name %></h4><%= status %><%= scheduleList %>'),
        scheduleItemTemplate: _.template('<div class="scheduleItem"><span class="day"><%- day %></span> from <span class="from"><%- from %></span> until <span class="to"><%- to %></span></div>'),
        closedTemplate: '<div class="status closed">Closed <i class="icon-time"></i></div>',
        openTemplate: '<div class="status open">Open <i class="icon-time"></i></div>',

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

            // Load the schedules for this truck by fetching the individual model.
            this.model.fetch().done(_.bind(this._calculateScheduleDisplay, this));
        },

        /**
         * Determine and display the schedule text for the truck.
         * 1. Sort the items by day of the week.
         * 2. Compile a list of <day> from <start> to <end> style texts
         * 3. Build the final HTML and set as the content of the info window.
         * @private
         */
        _calculateScheduleDisplay: function(){
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
                scheduleList: scheduleText,
                status: this._isOpenNow() ? this.openTemplate : this.closedTemplate
            });

            this.infoWindow.setContent(schedule);
        },

        /**
         * Determine if the truck is open now based on the schedule.
         * @returns {Boolean} true is the truck is open now, false otherwise.
         * FIXME: Assumes PDT
         * @private
         */
        _isOpenNow: function(){
            var currentTime = new Date();
            // Find the schedule for today
            var scheduleToday = _.find(this.model.schedule.models, function(schedule){
                return schedule.get('DayOrder') == currentTime.getDay();
            });
            if(!scheduleToday){
                return false;
            }
            // Create a quick function to generate our dates.
            var createDateFromTime = _.partial(function(year, month, day, hours){
                return new Date(year, month, day, parseInt(hours));
            }, currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

            var startTime = createDateFromTime(scheduleToday.get('start24'));
            var endTime = createDateFromTime(scheduleToday.get('end24'));
            return Boolean(startTime < currentTime && currentTime < endTime);
        },

        /**
         * Show the info window.
         */
        open: function(){
            this.infoWindow.open(this.options.map, this.options.marker);
        },

        /**
         * Close the info window
         */
        close: function(){
            this.infoWindow.close();
        },

        /**
         * Destroy the info window and the view
         */
        destroy: function(){
            this.close();
            this.infowWindow = null;
            this.remove();
        }
    })
});