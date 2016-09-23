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
            log.info("Rendering View - Search");

            $.extend(true, CatalogConfig, {}, this);


            this.$el.html("<h1>Hello world from Search f/t Catalog.</h1>");

            this.catalog = new Catalog(CatalogConfig);

            this.bindEventListeners();

            return this;
        },


        bindEventListeners: function () {
            var self = this;
            log.info("bindEventListeners()");
            this.catalog.on('select', function(ret){
                log.info("*select* triggered");
                self.selectResource(ret)
            });
        },

        selectResource: function (resource) {
            log.info("selectResource()");
            log.info("with resource: ", resource);

            RM.loadResource(resource);

        },



        accessControl: function () {

            return new Q.Promise(function (fulfilled, rejected) {

                //perform checks

                fulfilled();

                //rejected()

            });
        },



        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return SearchView;

});