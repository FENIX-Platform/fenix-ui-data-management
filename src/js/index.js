define([
    "loglevel",
    "jquery",
    "./routers/router",
    "../html/main.hbs",
    "../config/config",
    "./components/resource-manager"
], function (log, $, Router, Template, Config, RM) {

    "use strict";

    function DataManagement(o) {
        log.info("FENIX Data Management", o);
        $.extend(true, this, {}, o);
        $.extend(true, this.config, {}, Config);
        console.log(this.config);
        // Init Resource Manager Environment
        RM.setEnvironment(this.environment);
        this._attach();
        this._start();
    }

    DataManagement.prototype._attach = function () {
        //force this$el to be a jQuery object
        this.$el = $(this.el);
        //inject main template
        this.$el.html(Template);
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