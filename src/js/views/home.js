define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../../nls/labels',
    "../../html/home.hbs",
    "../../config/events"
], function ($, Backbone, log, Q, labels, template, EVT) {

    "use strict";

    var s = {
        btnMeta: "#btnMeta",
        btnDSD: "#btnDSD",
        btnData: "#btnData"
    };

    var HomeView = Backbone.View.extend({

        render: function (o) {

            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("Rendering View - Home", this);

                this._attach();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render Home");
                log.error(valid)
            }
        },

        _validateInput: function () {

            var valid = true,
                errors = [];
            
            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {

            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
        },

        _attach: function () {
            this.$el.html(template(labels)); //TODO i18n
        },

        _bindEventListeners: function () {

            this.$el.find(s.btnMeta).on("click", function () {
                Backbone.trigger(EVT.SHOW_METADATA);
            });
            this.$el.find(s.btnDSD).on("click", function () {
                Backbone.trigger(EVT.SHOW_DSD);
            });
            this.$el.find(s.btnData).on("click", function () {
                Backbone.trigger(EVT.SHOW_DATA);
            });

        },

        _unbindEventListeners: function () {
            this.$el.find(s.btnMeta).off();
            this.$el.find(s.btnDSD).off();
            this.$el.find(s.btnData).off();
        },

        accessControl: function (Resource) {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(Resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function () {
            this._unbindEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return HomeView;

});