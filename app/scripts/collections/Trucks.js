define(['backbone', 'models/Truck'], function(Backbone, Truck){
    return Backbone.Collection.extend({
        url: '../api.php/trucks',
        model: Truck,

        parse: function(response) {
            return response.data;
        }
    });
});

