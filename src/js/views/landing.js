define([
    "jquery",
    "backbone",
    "loglevel",
    '../../nls/labels'
],function( $, Backbone, log, MultiLang){

    "use strict";

    var LandingView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            this.lang = this.lang.toLowerCase();

            log.info("Rendering View - Landing");
            this.$el.html("<h1>"+MultiLang[this.lang]['DManHeader']+"</h1><hr><p>"+MultiLang[this.lang]['DManIntro']+"</p>");
            return this;
        },
        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return LandingView;

});