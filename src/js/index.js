/*global define, require*/
define([
    "loglevel",
    "jquery",
    "./routers/router",
    "../html/main.hbs",
    "../config/config",
    "../config/errors",
    "./components/resource-manager"
], function (log, $, Router, Template, Config, ERR, RM) {

    "use strict";

    function DataManagement(o) {
        log.info("FENIX Data Management", o);
        $.extend(true, this, {initial: o});

        this._parseInput();

        var valid = this._validateInput();

        if (valid === true) {
            log.info("DM: Config is valid");
            require("../css/fenix-ui-data-managment.css");
            log.info('Init Resource Manager Environment');
            RM.setEnvironment(this.environment);
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
    };

    DataManagement.prototype._parseInput = function () {

        this.$el = $(this.initial.el);
        this.cache = typeof this.initial.cache === "boolean" ? this.initial.cache : Config.cache;
        this.environment = this.initial.environment;
        this.lang = this.initial.lang || Config.lang;

        this.config = this.initial.config || Config;
        this.config.contextSystem = this.initial.dsdEditor.contextSystem || Config.contextSystem;
        this.config.datasources =  this.initial.dsdEditor.datasources || Config.datasources;

        this.dsdEditor = this.initial.dsdEditor || Config.dsdEditor;
        this.catalog = this.initial.catalog || Config.catalog;
        this.metadataEditor = this.initial.metadataEditor || Config.metadataEditor;

    };

    DataManagement.prototype._start = function () {

        this.router = new Router({
            $el: this.$el,
            cache: this.cache,
            environment: this.environment,
            lang : this.lang,
            dsdEditor : this.dsdEditor,
            catalog: this.catalog,
            config: this.config,
            metadataEditor: this.metadataEditor
        });

    };

    return DataManagement;

});