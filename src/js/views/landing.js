define([
    "backbone",
    "loglevel",
    "q"
],function( Backbone,log, Q){

    "use strict";

    var LandingView = Backbone.View.extend({

        render: function () {
            log.info("Rendering View - Landing");
            this.$el.html("<h1>Hello world from Landing</h1>");
            return this;
        },

        accessControl: function () {

            return new Q.Promise(function (fulfilled, rejected) {

                //perform checks

                fulfilled();

                //rejected()

            });
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return LandingView;

});