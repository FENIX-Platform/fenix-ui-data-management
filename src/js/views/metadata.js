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
            var self = this;
            log.info("{MDE} bindEventListeners()");
            $(this.savebtn).on("click", function(){
                RM.setMetadata(self.MDE.getValues());
            });

        },

        unbindEventListeners: function () {
            log.info("{MDE} unbindEventListeners()");
            $(this.savebtn).off("click");
        },


        initViews: function () {
            log.info("{MDE} initViews");
            console.log(RM.getMetadata());
            this.MDE = new MDE({
                el: this.$el,
                lang: this.lang,
                config: this.config,
                cache : this.cache,
                environment : this.environment,
                model: RM.getMetadata()
            });

        },

        accessControl: function () {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(RM.resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function() {
            this.unbindEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return MetadataView;

});