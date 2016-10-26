define([
    "jquery",
    "backbone",
    "loglevel",
    '../../nls/labels',
    "../../html/landing.hbs",
],function( $, Backbone, log, MultiLang, Template){

    "use strict";

    var LandingView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            this.s = {
                btnSearch : "#btnSearch",
                btnAdd : "#btnAdd"
            };

            this.lang = this.lang.toLowerCase();

            log.info("Rendering View - Landing");
            this.$el.html(Template);
            this.bindEventListeners();
            return this;
        },

        bindEventListeners: function() {
            var self = this;
            $(this.s.btnSearch).on("click", function() {
                self.router.navigate("#/search");
            });
            $(this.s.btnAdd).on("click", function() {
                self.router.navigate("#/add");
            });
        },
        removeEventListeners: function() {
            $(this.s.btnSearch).off("click");
            $(this.s.btnAdd).off("click");
        },
        remove: function() {
            this.removeEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return LandingView;

});