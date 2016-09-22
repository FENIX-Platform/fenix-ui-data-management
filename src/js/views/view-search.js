define([
    "loglevel"
],function(log){

    "use strict";

    var SearchView = Backbone.View.extend({
        render: function () {
            log.info("Rendering View - Search");
            $(this.el).html("<h1>Hello world from Search</h1>");
            return this;
        },
        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return SearchView;

});