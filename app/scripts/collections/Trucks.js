define(['backbone', 'models/Truck'], function(Backbone, Truck){
    return Backbone.Collection.extend({
        url: '../api.php/trucks',
        model: Truck,
        comparator: 'Applicant',

        parse: function(response) {
            return response.data;
        }
    });
});

