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

    var b = {
        btnMeta: "#btnMeta",
        btnDSD: "#btnDSD",
        btnData: "#btnData",
    },
        s = {
            DManResHeader: "#DManResHeader"
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
            this.disabledSections = this.initial.disabledSections;
            this.lang = this.initial.lang.toLowerCase();

            log.info('Disabled Sections', this.disabledSections);
        },

        _attach: function () {
            var self = this;
            this.$el.html(template({
                btnMeta: labels[this.lang]['btnMetadata'],
                btnDSD: labels[this.lang]['btnDSD'],
                btnData: labels[this.lang]['btnData'],
                DManResHeader: labels[this.lang]['DManResHeader']
            }));

            $.each(this.disabledSections, function(index,object){
                // hide disabled buttons
                self.$el.find(b[object]).parent().hide();
            });
        },

        _bindEventListeners: function () {

            if (this.$el.find(b.btnMeta).is(":visible"))
                this.$el.find(b.btnMeta).on("click", function () {
                    Backbone.trigger(EVT.SHOW_METADATA);
                });

            if (this.$el.find(b.btnDSD).is(":visible"))
                this.$el.find(b.btnDSD).on("click", function () {
                    Backbone.trigger(EVT.SHOW_DSD);
                });

            if (this.$el.find(b.btnData).is(":visible"))
                this.$el.find(b.btnData).on("click", function () {
                    Backbone.trigger(EVT.SHOW_DATA);
                });

        },

        _unbindEventListeners: function () {
            this.$el.find(b.btnMeta).off();
            this.$el.find(b.btnDSD).off();
            this.$el.find(b.btnData).off();
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