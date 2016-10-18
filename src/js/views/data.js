define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DataEditor",
    "../components/resource-manager",
    "../components/file-uploader",
    "../../html/file-uploader.hbs",

],function($, Backbone, log, Q, Data, RM, FileUploader, TemplateFU){

    "use strict";

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            this.UTILITY = '#fx-data-management-utility-holder';
            this.lang = this.lang.toLowerCase();
            log.info("{Data} Rendering View");
            this.initViews();
            this.bindEventListeners();
            return this;
        },

        initViews: function() {
            log.info("{Data} initViews");
            var config = { D3SConnector: { getMetaAndDataUrl: "http://faostat3.fao.org:7799/v2/msd/resources" } };

            var callB = function() {
                log.info('{Data} Editor Callback');
                log.info('{Data} Calling the Codelists');
                RM.generateDSDStructure().then (function (result) {
                    log.info('{Data} Calling the DSD');
                    var dsd = RM.getDSD();
                    Data.setColumns(dsd, result, function() {
                        log.info("{Data} Columns Setted.");
                        Data.setData(RM.getData());
                    });
                })
            };

            $(this.UTILITY).html(TemplateFU);

            Data.init(this.$el, config, callB);


        },

        bindEventListeners: function() {
            log.info('{DATA} bindEventListeners');

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

    return DataView;

});