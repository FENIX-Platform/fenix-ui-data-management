define([
    "backbone",
    "loglevel"
],function(Backbone, log){

    "use strict";

    var DeniedView = Backbone.View.extend({

        render: function () {
            log.info("Rendering NOtFound - Search");

            this.$el.html("<h1>!Denied</h1>");
            return this;
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return DeniedView;

});