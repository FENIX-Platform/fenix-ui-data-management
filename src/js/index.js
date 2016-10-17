define([
    "loglevel",
    "jquery",
    "./routers/router",
    "../html/main.hbs",
    "./components/resource-manager"
], function (log, $, Router, Template, RM) {

    "use strict";

    function DataManagement(o) {
        log.info("FENIX Data Management", o);
        $.extend(true, this, {}, o);
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
            dsdEditor : this.dsdEditor
        });
    };

    return DataManagement;

});