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
            RM.newResource(o.config);
            return this;
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return AddView;

});