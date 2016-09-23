define([
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-catalog",
    "fenix-ui-bridge",
    "../components/resource-manager"

],function(Backbone, log, Q, Catalog, Bridge, RM){

    "use strict";

    var SearchView = Backbone.View.extend({


        render: function () {
            log.info("Rendering View - Search");

            this.$el.html("<h1>Hello world from Search f/t Catalog.</h1>");

            this.catalog = new Catalog({
                el: this.$el,
                lang : this.lang,
                defaultSelectors: ['resourceType', 'contextSystem'],
                environment: this.environment,
                hideCloseButton : true,
                pluginRegistry : {
                    contextSystem : {
                        selector : {
                            id : "dropdown",
                            source : [
                                {value : "cstat_afg", label : "CountrySTAT Afghanistan"},
                                {value : "uneca", label : "UNECA"}
                            ],
                            default : ["cstat_afg"],
                            hideSummary : true,
                            config : {
                                plugins: ['remove_button'],
                                mode: 'multi'
                            }
                        },

                        template : {
                            hideRemoveButton : false
                        },

                        format : {
                            output : "enumeration",
                            metadataAttribute: "dsd.contextSystem"
                        }
                    }
                }
                //actions: ["download", 'view'],
                //baseFilter : { test : "test"}
            });

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