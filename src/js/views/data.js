define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DataEditor",
    "../../config/data-editor",
    "../components/resource-manager",
    "../components/file-uploader",
    "../../html/file-uploader.hbs",

],function($, Backbone, log, Q, Data, Config, RM, FileUploader, TemplateFU){

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

            this.lang = this.lang.toLowerCase();
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
                    log.info('{Data} Calling the DSD');
                    var dsd = RM.getDSD();
                    Data.setColumns(dsd, result, function() {
                        log.info("{Data} Columns Setted.");
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
            var conv = Data.CSV_To_Dataset(conf,$(this.s.csvSeparator).val());
            console.log(conv);
            //conv.convert(data);

/*
            this.tmpCsvCols = conv.getColumns();
            this.tmpCsvData = conv.getData();
*/
            console.log(this);

            /*
            //Validates the CSV structure (null columns, less columns than the DSD...)
            var valRes = CSV_Val.validate(DataEditor.getColumns(), DataEditor.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++) {
                    Noti.showError(MLRes.error, MLRes[valRes[n].type]);
                }
                return;
            }

            this._showCSvColumnMatcher();
            this.columnsMatch.setData(this.resource.metadata.dsd, this.tmpCsvCols, this.tmpCsvData);
            /*
             //Validates the CSV contents
             var dv = new DataValidator();
             var wrongDatatypes = dv.checkWrongDataTypes(DataEditor.getColumns(), this.cLists, this.tmpCsvData);

             if (wrongDatatypes && wrongDatatypes.length > 0) {
             for (n = 0; n < wrongDatatypes.length; n++) {
             Noti.showError(MLRes.error, MLRes[wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
             }
             return;
             }

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
            this.unbindEventListeners();
            $(this.UTILITY).html('');
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DataView;

});