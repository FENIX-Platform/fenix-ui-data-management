define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DataEditor",
    '../components/resource-manager'

],function($, Backbone, log, Q, Data, RM){

    "use strict";

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            this.lang = this.lang.toLowerCase();
            log.info("{Data} Rendering View");
            this.initViews();
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
                    console.log("params");
                    console.log(JSON.stringify(dsd));
                    console.log(JSON.stringify(result));
                    Data.setColumns(dsd, result, function() {
                        log.info("{Data} Columns Setted.");
                        Data.setData(RM.getData());
                    });
                    /*
                    Data.setColumns(RM.getDSD, result, function() {
                        log.info("{Data} Columns Setted.");
                        Data.setData(RM.getData());
                    });
                    */
                })
            };

            Data.init(this.$el, config, callB);

            /*
             DataEditor.isEditable(false);
             DataEditor.setColumns(testDSD, {'CountrySTAT_Indicators': Codelist}, callB);
             DataEditor.setData(testData);

             */

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