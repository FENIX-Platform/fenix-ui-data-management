define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-metadata-editor",
    '../components/resource-manager'

],function($, Backbone, log, Q, MDE, RM){

    "use strict";

    var MetadataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            log.info("Rendering View - Metadata", this);
            this.lang = this.lang.toLowerCase();
            log.info("{MDE} Rendering View");
            this.initViews();
            this.bindEventListeners();
            return this;

        },

        bindEventListeners: function () {
            log.info("{MDE} bindEventListeners()");
            $(this.savebtn).on("click", function(){
                console.log(MDE)
                console.log(MDE.getValues('plain'));
                //RM.setMetadata(MDE.getValues('plain'));
                //RM.updateResource();
            });

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
            //    if (!$.isEmptyObject(RM.resource)) {
                    fulfilled();
            //    } else {
            //        rejected();
            //    }
            });
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return MetadataView;

});