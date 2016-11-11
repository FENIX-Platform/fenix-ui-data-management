define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-catalog",
    "../../config/catalog",
    "fenix-ui-bridge",
    "../../config/errors",
    "../../html/search.hbs"
], function ($, Backbone, log, Q, Catalog, CatalogConfig, Bridge, ERR, Template) {
    "use strict";

    var s = {
        CATALOG: "#catalog-container"
    };

    var SearchView = Backbone.View.extend({

        render: function (o) {
            console.log(o)
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

            this.$el = $(this.initial.el);

            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();

            $.extend(true, CatalogConfig, this.initial.catalog);

        },

        _attach: function () {

            this.$el.html(Template);
        },

        _initCatalog: function () {

            console.log(this.$el.find(s.CATALOG));

            var model = $.extend(true, {
                el: this.$el.find(s.CATALOG),
                cache: this.cache,
                lang: this.lang,
                environment: this.environment
            }, this.catalogConfig);

            console.log(model)

            this.catalog = new Catalog(model);
        },

        _bindEventListeners: function () {

            log.info("{SEARCH} bindEventListeners()");

            this.catalog.on('select', function (ret) {

                log.info("*select* triggered");

                Backbone.trigger("resource:loading", ret);
            });
        },

        remove: function () {
            this.catalog.dispose();

            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return SearchView;

});