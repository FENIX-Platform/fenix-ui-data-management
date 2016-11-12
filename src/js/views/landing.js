define([
    "jquery",
    "backbone",
    "loglevel",
    '../../nls/labels',
    "../../html/landing.hbs",
    '../../config/errors',
    '../../config/events',
], function ($, Backbone, log, labels, Template, ERR, EVT) {

    "use strict";
    var s = {
        btnSearch: "#btnSearch",
        btnAdd: "#btnAdd"
    };

    var LandingView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {
                log.info("Rendering View - Landing", this);

                this._attach();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render Landing");
                log.error(valid)
            }
        },

        _attach: function () {
            this.$el.html(Template);
        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$el.length === 0) {
                errors.push({code: ERR.MISSING_CONTAINER});
                log.warn("Impossible to find container");
            }

            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {

            this.cache = this.initial.cache;

            this.environment = this.initial.environment;

            this.lang = this.initial.lang.toLowerCase();
        },

        _bindEventListeners: function () {

            this.$el.find(s.btnSearch).on("click", function () {
                Backbone.trigger(EVT.SHOW_SEARCH);
            });

            this.$el.find(s.btnAdd).on("click", function () {
                Backbone.trigger(EVT.SHOW_ADD);
            });
        },

        _unbindEventListeners: function () {

            this.$el.find(s.btnSearch).off();

            this.$el.find(s.btnAdd).off();
        },

        remove: function () {

            this._unbindEventListeners();

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return LandingView;

});