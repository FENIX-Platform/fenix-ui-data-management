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
                Data.setData(RM.getData());
                log.info('{Data} Calling DSD');
                var curCodelist = RM.getCodelist('UNECA_ClassificationOfActivities');
                Data.setColumns(RM.getDSD, {'UNECA_ClassificationOfActivities': curCodelist}, function() {
                    console.log("qua");
                });
                log.info('{Data} Calling the Codelists');
//              DataEditor.setColumns(testDSD, {'CountrySTAT_Indicators': Codelist}, callB);
                console.log();
            };

            Data.init(this.$el, config, callB);

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