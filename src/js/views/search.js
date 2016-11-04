define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-catalog",
    "../../config/catalog",
    "fenix-ui-bridge",
    "../../config/errors",
    "../../html/search.hbs",

],function($, Backbone, log, Q, Catalog, CatalogConfig, Bridge, ERR, Template){

    "use strict";

    var s = {
        catalogContainer : "#catalog-container"
    };

    var SearchView = Backbone.View.extend({


        render: function (o) {
            $.extend(true, this, { initial: o });
            $.extend(true, CatalogConfig, { initial: o.catalog });

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - Search", this);
                this.$container.html(Template);
                this.catalog = new Catalog(CatalogConfig);
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

            //Check if $el exist
            if (this.$container.length === 0) {
                errors.push({code: ERR.MISSING_CONTAINER});
                log.warn("Impossible to find container");
            }

            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {

            this.$container = $(this.initial.container);
            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();

            CatalogConfig.el =  CatalogConfig.initial.el || s.catalogContainer;
            CatalogConfig.lang =  CatalogConfig.initial.lang || this.lang;
            CatalogConfig.environment =  CatalogConfig.initial.environment || this.environment;

        },


        _bindEventListeners: function () {
            log.info("{SEARCH} bindEventListeners()");
            this.catalog.on('select', function(ret){
                log.info("*select* triggered");
                Backbone.trigger("resource:loading",ret);
            });
        },

        accessControl: function (Resource) {
            //TODO: Currently, if a resource is present, stay where you are.
            //TODO: I don't know if this is correct, but I would suggest this kind of approach.
            return new Q.Promise(function (fulfilled) {
                if ($.isEmptyObject(Resource)) fulfilled();
            });
        },

        remove: function() {
            this.catalog.dispose();
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return SearchView;

});