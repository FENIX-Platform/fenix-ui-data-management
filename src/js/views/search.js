define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-catalog",
    "../../config/catalog",
    "fenix-ui-bridge",
    "../components/resource-manager"

],function($, Backbone, log, Q, Catalog, CatalogConfig, Bridge, RM){

    "use strict";

    var SearchView = Backbone.View.extend({


        render: function () {
            log.info("{SEARCH} Rendering View");

            $.extend(true, CatalogConfig, {}, this);
            this.catalog = new Catalog(CatalogConfig);
            this.bindEventListeners();
            RM.unloadResource();

            return this;
        },

        bindEventListeners: function () {
            var self = this;
            log.info("{SEARCH} bindEventListeners()");
            this.catalog.on('select', function(ret){
                log.info("*select* triggered");
                self.selectResource(ret)
            });
        },

        selectResource: function (resource) {
            log.info("{SEARCH} selectResource() ", resource);

            RM.loadResource(resource);
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return SearchView;

});