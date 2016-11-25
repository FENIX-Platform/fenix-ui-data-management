define([
    "jquery",
    "backbone",
    "underscore",
    "loglevel",
    "q",
    "fenix-ui-DSDEditor",
    "fenix-ui-filter",
    "fenix-ui-bridge",
    "../../html/dsd.hbs",
    "../../config/events",
    '../../nls/labels',
], function ($, Backbone, _, log, Q, DsdEditor, Filter, Bridge, template, EVT, labels) {

    "use strict";

    var s = {
        SAVE_BUTTON: '[data-role="save"]',
        DSD_EL: '[data-role="dsd"]',
        COPY_FORM: "[data-role='form']",
        COPY_BUTTON: "[data-role='copy']"
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

                this._initComponents();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render DSD");
                log.error(valid)
            }
        },

        _attach: function () {
            this.$el.html(template({
                isEditable: this.isEditable,
                copyTitle:  labels[this.lang]['MetaCopyHeader']
            }));
        },

        _initComponents: function () {

            this.bridge = new Bridge({
                cache: this.cache,
                environment: this.environment
            });

            this._initDsdEditor();

            this._initCopyDsd();

        },
        _initVariables: function () {

            this.$saveButton = this.$el.find(s.SAVE_BUTTON);

            this.$copyButton = this.$el.find(s.COPY_BUTTON);
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

        _initCopyDsd: function () {

            this.copyForm = new Filter({
                el: this.$el.find(s.COPY_FORM),
                selectors: {
                    uid: {
                        selector: {
                            id: "input",
                            type: "text",
                            source: [{label: "Uid"}]
                        },
                        constraints: {
                            presence: true
                        }
                    },
                    version: {
                        selector: {
                            id: "input",
                            type: "text",
                            source: [{label: "Version"}]
                        }
                    }
                }
            })

        },

        _bindEventListeners: function () {
            log.info("{DSD} bindEventListeners()");

            this.$saveButton.on("click", _.bind(this._onSaveClick, this));

            this.$copyButton.on("click", _.bind(this._onCopyClick, this));
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
                        dsd: true,
                        export: true
                    }
                }).then(
                    _.bind(function (resource) {

                        var metadata = resource.metadata || {},
                            dsd = metadata.dsd || {},
                            columns = dsd.columns || [];

                        if (columns.length > 0) {
                            this.dsd.set(columns);
                            Backbone.trigger(EVT.DSD_COPY_SUCCESS);
                        } else {
                            Backbone.trigger(EVT.DSD_COPY_EMPTY_RESOURCE);
                        }

                    }, this),
                    _.bind(function (msg) {
                        Backbone.trigger("error:showerrormsg", msg);

                    }, this)
                );
            }

        },

        _onSaveClick: function () {

            console.log('_onSaveClick');

            var obj = {
                columns: this.dsd.get(),
                datasources: this.config.datasources,
                contextSystem: this.config.contextSystem
            };

            log.info("{DSD} saving", obj);

            if (obj.columns.length > 0) {
                Backbone.trigger(EVT.DSD_SAVE, obj);
            } else {
                Backbone.trigger(EVT.DSD_INFO, "DSD_MINIMUM");
            }

        },

        _unbindEventListeners: function () {
            this.$saveButton.off("click");
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