define([
    "jquery",
    "backbone",
    "loglevel",
    '../components/resource-manager'

],function($, Backbone, log, RM){

    "use strict";

    var AddView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);
            log.info("Rendering View - Add", this);
            //this.$el.html("<h1>Hello world from Add</h1>");
            RM.newResource();
            return this;
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return AddView;

});