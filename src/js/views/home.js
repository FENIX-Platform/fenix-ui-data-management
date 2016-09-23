define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../components/resource-manager'
],function($, Backbone,log, Q, RM){

    "use strict";

    var HomeView = Backbone.View.extend({

        render: function () {
            console.log(RM.resource)
            log.info("Rendering View - Home");
            this.$el.html("<h1>Hello world from Home</h1><br>This is our object:<br><blockquote>" + JSON.stringify(RM.resource) + "</blockquote>" );
            return this;
        },

        accessControl: function () {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(RM.resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return HomeView;

});