define([
    "jquery",
    "backbone",
    "loglevel",
    "fenix-ui-catalog",
    "../../config/catalog",
    "fenix-ui-bridge",
    "../../config/errors",
    "../../config/events",
    "../../html/search.hbs"
], function ($, Backbone, log, Catalog, CatalogConfig, Bridge, ERR, EVT, template) {
    "use strict";

    var s = {
        CATALOG: "#catalog-container"
    };

    var SearchView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {
                log.info("Rendering View - Search", this);

                this._attach();

                this._initCatalog();

                this._bindEventListeners();

                return this;
            } else {
                log.error("Impossible to render Search");
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
            this.serviceProvider = this.initial.serviceProvider || undefined ;

            this.catalogConfig = $.extend(true, CatalogConfig, this.initial.catalog);
        },

        _attach: function () {

            this.$el.html(template);
        },

        _initCatalog: function () {

            var model = $.extend(true, {
                el: this.$el.find(s.CATALOG),
                cache: this.cache,
                lang: this.lang,
                environment: this.environment
            }, this.catalogConfig);

            this.catalog = new Catalog(model);

            console.log("this model: ", model);
        },

        _bindEventListeners: function () {
            log.info("{SEARCH} bindEventListeners()");

            this.catalog.on('select', function (payload) {

                log.info("*select* triggered");

                Backbone.trigger(EVT.RESOURCE_LOAD, payload);
            });
        },

        remove: function () {
            this.catalog.dispose();

            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return SearchView;

});