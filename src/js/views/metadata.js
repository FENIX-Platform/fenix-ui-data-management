define([
    "jquery",
    "backbone",
    "underscore",
    "loglevel",
    "q",
    "fenix-ui-metadata-editor",
    "fenix-ui-filter",
    "fenix-ui-bridge",
    "../../html/metadata.hbs",
    "../../config/events",
    '../../nls/labels',
], function ($, Backbone, _, log, Q, MDE, Filter, Bridge, template, EVT, labels) {

    "use strict";

    var s = {
        SAVE_BUTTON: '[data-role="save"]',
        METADATA: '[data-role="metadata"]',
        COPY_FORM: "[data-role='form']",
        COPY_BUTTON: "[data-role='copy']"
    };

    var MetadataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            console.log(this.initial);

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("Rendering View - Metadata", this);

                this._attach();

                this._initVariables();

                this._initComponents();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render Metadata");
                log.error(valid)
            }
        },

        _initComponents : function() {

            this.bridge = new Bridge({
                cache: this.cache,
                environment: this.environment
            });

            this._initMetadataEditor();

            this._initCopyMetadata();

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
            this.label = this.initial.label || "";
            this.copy = (this.initial.copy === undefined) ? true : this.initial.copy;
            this.converters = this.initial.converters;

        },

        _attach: function () {
            this.$el.html(template({
                lblMeta: this.label,
                label: (this.label.length),
                copyTitle: labels[this.lang]['MetaCopyHeader'],
                copyAlt: labels[this.lang]['MetaCopyAlt'],
                saveBtn: labels[this.lang]['btnUpdateResource'],
                copyMeta: this.copy
            }));
        },

        _initVariables: function () {
            this.$savebtn = this.$el.find(s.SAVE_BUTTON);
            this.$copyButton = this.$el.find(s.COPY_BUTTON);
        },

        _bindEventListeners: function () {
            this.$savebtn.on("click", _.bind(this._onSaveClick, this));
            this.$copyButton.on("click", _.bind(this._onCopyClick, this));
        },

        _onSaveClick : function () {

            var values = this.MDE.getValues();
            log.info("Metadata values:");
            log.info(values);


            if (!values.hasOwnProperty("valid")) {
                if (values.uid === undefined ) {
                    Backbone.trigger(EVT.METADATA_CREATE, values);
                } else {
                    Backbone.trigger(EVT.METADATA_SAVE, values);
                }
            } else {
                Backbone.trigger(EVT.METADATA_INFO, "metadataValidationWarning");
            }

        },

        _onCopyClick: function (e) {
            e.stopPropagation();

            var values = this.copyForm.getValues(),
                uid = values.values.uid[0],
                version = values.values.version[0];

            if (values.valid === true) {

                this.bridge.getResource({
                    uid: uid,
                    version: version,
                    params: {
                        full: true,
                        dsd: true,
                        export: true
                    }
                }).then(
                    _.bind(function (resource) {

                        if (!resource) {
                            Backbone.trigger(EVT.METADATA_COPY_EMPTY_RESOURCE);
                        } else {

                            var metadata = resource.metadata || {};

                            delete metadata.uid;

                            delete metadata.version;

                            delete metadata.title;

                            this.MDE.setValues(metadata);

                            Backbone.trigger(EVT.METADATA_COPY_SUCCESS);
                        }

                    }, this),
                    _.bind(function (msg) {
                        Backbone.trigger("error:showerrormsg", msg);

                    }, this)
                );
            }

        },

        _initCopyMetadata: function () {

            this.copyForm = new Filter({
                el: this.$el.find(s.COPY_FORM),
                selectors: {
                    uid: {
                        selector: {
                            id: "input",
                            type: "text"
                        },
                        constraints: {
                            presence: true
                        },
                        template: {
                            title: "UID"
                        }
                    },
                    version: {
                        selector: {
                            id: "input",
                            type: "text"
                        },
                        template: {
                            title: "Version"
                        }
                    }
                }
            })

        },

        _initMetadataEditor: function () {
            log.info("{MDE} initViews");

            var model = {
                el: s.METADATA,
                lang: this.lang,
                config: this.config,
                cache: this.cache,
                converters: this.converters,
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