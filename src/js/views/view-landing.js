define([
    "loglevel"
],function(log){

    "use strict";

    var LandingView = Backbone.View.extend({
        render: function () {
            log.info("Rendering View - Landing");
            $(this.el).html("<h1>Hello world from Landing</h1>");
            return this;
        }
    });

    return LandingView;

});