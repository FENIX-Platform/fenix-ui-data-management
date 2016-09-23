define([
    "backbone",
    "loglevel",
    "q"
],function( Backbone,log, Q){

    "use strict";

    var DeleteView = Backbone.View.extend({

        render: function () {
            log.info("Rendering View - Delete");
            this.$el.html("<h1>Hello world from Delete</h1>");
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

    return DeleteView;

});