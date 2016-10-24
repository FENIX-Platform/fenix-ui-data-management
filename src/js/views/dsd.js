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
            var self = this;
            $(this.savebtn).on("click", function(){
                log.info("{DSD} click", self.dsd.get());
                RM.setDSDColumns(self.dsd.get());
                //RM.updateDSD();
            });

        },

        initViews: function() {

            log.info("{DSD} initViews", this.config);
            console.log("this is the DSD: ", RM.getDSD());
            var cfg = this.config;
            this.dsd = DSD;

            this.dsd.init(this.$el, cfg, null);
            var col = RM.getDSD();
            log.info('{DSD}', col.columns);
            if (col.columns !== undefined && col.columns.length) this.dsd.set(col.columns);
            log.info('{DSD} is editable', RM.isDSDEditable());
            console.log('{DSD} ' + (RM.isDSDEditable()))
            this.dsd.editable(RM.isDSDEditable());

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
            log.info("{DSD} remove");
            $(this.savebtn).off("click");
            this.$el.html('');
            this.dsd.destroy();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DSDView;

});