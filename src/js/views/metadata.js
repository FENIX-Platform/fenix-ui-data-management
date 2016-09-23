define([
    "backbone",
    "loglevel",
    "q"
],function( Backbone,log, Q){

    "use strict";

    var MetadataView = Backbone.View.extend({

        render: function () {
            log.info("Rendering View - Metadata");
            this.$el.html("<h1>Hello world from Metadata</h1>");
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

    return MetadataView;

});