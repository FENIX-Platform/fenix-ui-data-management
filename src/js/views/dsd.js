define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DSDEditor",
    '../components/resource-manager'

],function($, Backbone, log, Q, DSD, RM){

    "use strict";

    var DSDView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            this.lang = this.lang.toLowerCase();
            log.info("{DSD} Rendering View", this);
            this.initViews();
            this.bindEventListeners();
            return this;
        },

        bindEventListeners: function () {
            log.info("{DSD} bindEventListeners()");
            $(this.savebtn).on("click", function(){
                RM.setDSD(DSD.get());
            });

        },

        initViews: function() {
            log.info("{DSD} initViews", this.config);

            var cfg = this.config;
            var callB = function() {
                log.info('{DSD} Editor Callback');
                DSD.set(RM.getDSD());
                log.info('{DSD} is editable ',RM.isDSDEditable());
                DSD.editable(RM.isDSDEditable());
            };

            DSD.init(this.$el, cfg, callB);

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
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DSDView;

});