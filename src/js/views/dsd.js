define([
    "jquery",
    "backbone",
    "underscore",
    "loglevel",
    "q",
    "fenix-ui-DSDEditor",
    "../../html/dsd.hbs",
    "../../config/events"
], function ($, Backbone, _, log, Q, DsdEditor, template, EVT) {

    "use strict";

    var s = {
        SAVE_BUTTON: '[data-role="save"]',
        DSD_EL: '[data-role="dsd"]'
    };

    var DSDView = Backbone.View.extend({

        render: function (o) {

            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("Rendering View - DSD", this);

                this._attach();

                this._initVariables();

                this._initDsdEditor();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render DSD");
                log.error(valid)
            }
        },

        _attach: function () {
            this.$el.html(template());
        },

        _initVariables: function () {

            this.$savebtn = this.$el.find(s.SAVE_BUTTON);
        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {


            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
            this.config = this.initial.config;
            this.model = this.initial.model;
            this.isEditable = this.initial.isEditable;

        },

        _initDsdEditor: function () {
            log.info("{DSD} initViews");

            this.dsd = DsdEditor;

            this.dsd.init(this.$el.find(s.DSD_EL), this.config, null);

            if (this.model && Array.isArray(this.model.columns) && this.model.columns.length > 0) {
                this.dsd.set(this.model.columns);
            }

            log.info('{DSD} is editable', this.isEditable);

            this.dsd.editable(this.isEditable);

        },

        _bindEventListeners: function () {
            log.info("{DSD} bindEventListeners()");

            this.$savebtn.on("click", _.bind(this._onSaveClick, this));
        },

        _onSaveClick: function () {

            var obj = {
                columns: this.dsd.get(),
                datasources: this.config.datasources,
                contextSystem: this.config.contextSystem
            };

            log.info("{DSD} saving", obj);

            Backbone.trigger(EVT.DSD_SAVE, obj);
        },

        _unbindEventListeners: function () {
            this.$savebtn.off("click");
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
            log.info("{DSD} remove");

            this._unbindEventListeners();

            this.dsd.destroy();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DSDView;

});