define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-metadata-editor",
],function($, Backbone, log, Q, MDE){

    "use strict";

    var MetadataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            log.info("Rendering View - Metadata", this);
            this.lang = this.lang.toLowerCase();
            log.info("{MDE} Rendering View");
            this.initViews();
            //this.bindEventListeners();
            return this;

        },

        initViews: function () {
            log.info("{MDE} initViews");

            this.MDE = new MDE({
                el: this.$el,
                lang: this.lang,
                config: this.config,
                cache : this.cache,
                environment : this.environment
        });

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

    return MetadataView;

});