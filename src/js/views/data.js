define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "toastr",
    "fenix-ui-DataEditor",
    "../../config/data-editor",
    "../../config/notify",
    "../components/resource-manager",
    "../components/file-uploader",
    "../../html/file-uploader.hbs",

],function($, Backbone, log, Q, Notify, Data, Config, NotiConfig, RM, FileUploader, TemplateFU){

    "use strict";

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            // Buttons
            this.s = {
                utility: '#fx-data-management-utility-holder',
                btnDelAllData: "#btnDelAllData",
                dataFileUpload: "#dataFUpload",
                csvSeparator: "input[name=csvSeparator]:checked",
            };

            Notify.options = NotiConfig;

            this.lang = this.lang.toLowerCase();
            this.cLists = RM.getCurrentResourceCodelists();
            log.info("{Data} Rendering View");
            this.initViews();
            this.initFileUploader();
            this.bindEventListeners();
            return this;
        },

        initViews: function() {
            log.info("{Data} initViews");
            var config = Config;

            var callB = function() {
                log.info('{Data} Editor Callback');
                log.info('{Data} Calling the Codelists');
                RM.generateDSDStructure().then (function (result) {
                    log.info('{Data} Calling the DSD',result);
                    var dsd = RM.getDSD();
                    log.info('{Data} Setting the DSD...', dsd);
                    Data.setColumns(dsd, result, function() {
                        log.info("{Data} DSD Columns Setted.");
                        Data.setData(RM.getData());
                    });
                })
            };

            $(this.s.utility).html(TemplateFU);

            Data.init(this.$el, config, callB);

        },

        initFileUploader: function() {
            this.fUpload = new FileUploader({ accept: ['csv'] });
            this.fUpload.render(this.s.dataFileUpload);
        },

        bindEventListeners: function() {
            log.info('{DATA} bindEventListeners');
            $(this.s.btnDelAllData).on('click', function() {
                console.log("btnDelAllData");
            });
            $(this.savebtn).on("click", function(){
                console.log("savebtn");
            });

            this.listenTo(Backbone, "data:uploaded", function(str) {
                log.info("{DATA}[EVT] data:uploaded ");
                this.csvLoaded(str);
            });


        },

        unbindEventListeners: function(){

        },

        csvLoaded: function (data) {
            log.info('{DATA} csvLoaded', data);
            this.fUpload.reset();
            var conf = {};
            var conv = new Data.CSV_To_Dataset(conf,$(this.s.csvSeparator).val());
            conv.convert(data);

            this.tmpCsvCols = conv.getColumns();
            this.tmpCsvData = conv.getData();

            var validator = new Data.Validator_CSV();

            //Validates the CSV structure (null columns, less columns than the DSD...)
            var valRes = validator.validate(Data.getColumns(), Data.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++) {
                    //console.log(MLRes.error, MLRes[valRes[n].type]);
                    Notify["error"](valRes[n].type);
                }
                return;
            }

            //this._showCSvColumnMatcher(); <- this is needed
            //this.columnsMatch.setData(this.resource.metadata.dsd, this.tmpCsvCols, this.tmpCsvData);

            //Validates the CSV contents
            var dv = new Data.Data_Validator();
/*
            console.log(JSON.stringify(Data.getColumns()));
            console.log(JSON.stringify(RM.getCurrentResourceCodelists()));
            console.log(JSON.stringify(this.tmpCsvData));
*/
            var wrongDatatypes = dv.checkWrongDataTypes(Data.getColumns(), this.cLists, this.tmpCsvData);

             if (wrongDatatypes && wrongDatatypes.length > 0) {
                 for (n = 0; n < wrongDatatypes.length; n++) {
                     Notify["error"]([wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                 }
                 return;
             }


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
            log.warn("{DATA} - Remove View");
            this.unbindEventListeners();
            $(this.s.utility).html('');
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DataView;

});