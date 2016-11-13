define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-metadata-editor",
    "../../html/metadata.hbs",
    "../../config/events"
], function ($, Backbone, log, Q, MDE, template, EVT) {

    "use strict";

    var s = {
        SAVE_BUTTON: '[data-role="save"]',
        METADATA: '[data-role="metadata"]'
    };

    var MetadataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("Rendering View - Metadata", this);

                this._attach();

                this._initVariables();

                this._initMetadataEditor();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render Metadata");
                log.error(valid)
            }
        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {

            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
            this.model = this.initial.model;
            this.config = this.initial.config;
        },

        _attach: function () {
            this.$el.html(template()); //TODO i18n
        },

        _initVariables: function () {
            this.$savebtn = this.$el.find(s.SAVE_BUTTON);
        },

        _bindEventListeners: function () {

            var self = this;

            this.$savebtn.on("click", function () {

                var values = self.MDE.getValues();
                log.info("Metadata values:");
                log.info(values);

                if (!values.hasOwnProperty("valid")) {
                    Backbone.trigger(EVT.METADATA_SAVE, values);
                } else {
                    Backbone.trigger(EVT.METADATA_INFO, "metadataValidationWarning");
                }
            });

        },

        _initMetadataEditor: function () {
            log.info("{MDE} initViews");

            var model = {
                el: s.METADATA,
                lang: this.lang,
                config: this.config,
                cache: this.cache,
                environment: this.environment,
                model: this.model
            };

            log.info("Metadata editor model:");
            log.info(model);

            this.MDE = new MDE(model);

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

        _unbindEventListeners: function () {
            this.$savebtn.off("click");
        },

        remove: function () {
            this._unbindEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return MetadataView;

});