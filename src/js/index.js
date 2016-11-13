/*global define, require*/
define([
    "loglevel",
    "jquery",
    "./routers/router",
    "../html/main.hbs",
    "../config/config",
    "../config/errors",
    "../config/catalog",
    "../config/dsd-editor",
    "../config/data-editor",
    "../config/metadata-editor"
], function (log, $, Router, Template, C, ERR, CatalogConfig, DsdEditorConfig, DataEditorConfig, MetadataEditorConfig) {

    "use strict";

    function DataManagement(o) {
        log.info("FENIX Data Management", o);

        $.extend(true, this, {initial: o});

        require("../css/fenix-ui-data-managment.css");

        this._parseInput();

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._start();

        } else {
            log.error("Impossible to create Data Management");
            log.error(valid)
        }
    }

    DataManagement.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: ERR.MISSING_CONTAINER});
            log.warn("Impossible to find container");
        }

        return errors.length > 0 ? errors : valid;
    };

    DataManagement.prototype._attach = function () {
        this.$el.html(Template);

        log.info("Template attach : success");
    };

    DataManagement.prototype._parseInput = function () {

        this.$el = $(this.initial.el);
        this.cache = typeof this.initial.cache === "boolean" ? this.initial.cache : C.cache;
        this.environment = this.initial.environment;
        this.lang = this.initial.lang || C.lang;

        this.catalogConfig = this.initial.catalog || CatalogConfig;
        this.dsdEditorConfig = this.initial.dsdEditor || DsdEditorConfig;
        this.dataEditorConfig = this.initial.dataEditor || DataEditorConfig;
        this.metadataEditorConfig = this.initial.metadataEditor || MetadataEditorConfig;
        this.config = this.initial.config || C.config;
    };

    DataManagement.prototype._start = function () {

        var model = {
            $el: this.$el,
            cache: this.cache,
            environment: this.environment,
            lang : this.lang,
            config: this.config,
            catalogConfig: this.catalogConfig,
            metadataEditorConfig: this.metadataEditorConfig,
            dsdEditorConfig : this.dsdEditorConfig,
            dataEditorConfig : this.dataEditorConfig
        };

        log.info("Router config:");
        log.info(model);

        this.router = new Router(model);

        log.info("Router start: success");
    };

    return DataManagement;

});