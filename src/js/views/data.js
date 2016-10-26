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
    '../../nls/labels'
],function($, Backbone, log, Q, Notify, Data, Config, NotiConfig, RM, FileUploader, TemplateFU, MultiLang){

    "use strict";

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            // Buttons
            this.s = {
                utility: '#fx-data-management-utility-holder',
                btnFileUploader: "#btnFileUploader",
                btnDelAllData: "#btnDelAllData",
                dataFileUpload: "#dataFUpload",
                csvSeparator: "input[name=csvSeparator]:checked",
                dataUploadColsMatch: "#DataUploadColsMatch",
                dataEditorContainer: "#divDataEditor",
                dataUploadContainer: "#DataUploadContainer",
                divCsvMatcher: "#divCsvMatcher",
                btnCsvMatcherOk : "#btnCsvMatcherOk",
                btnCsvMatcherCancel : "#btnCsvMatcherCancel",
                btnDataMergeKeepNew: "#btnDataMergeKeepNew",
                btnDataMergeKeepOld: "#btnDataMergeKeepOld",
                btnDataMergeCancel: "#btnDataMergeCancel"
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
            log.info("{Data} initViews", Config);
            var config = Config;

            var callB = function() {};

            $(this.s.utility).html(TemplateFU);

            this.$dataUploadColsMatch = $(this.s.dataUploadColsMatch);
            this.$dataEditorContainer = $(this.s.dataEditorContainer);
            this.$dataUploadContainer = $(this.s.dataUploadContainer);

            this.columnsMatch = new Data.Columns_Match();

            Data.init(this.$el, config, null);
            log.info('{Data} Calling the Codelists');
            RM.generateDSDStructure().then (function (result) {
                log.info('{Data} Calling the DSD', result);
                var dsd = RM.getDSDColumns();
                log.info('{Data} Setting the DSD...', dsd);
                Data.setColumns(dsd, result, null);
                log.info("{Data} DSD Columns Setted.",RM.getData());
                if (RM.getData() !== undefined) Data.setData(RM.getData());
            })

        },

        initFileUploader: function() {
            this.fUpload = new FileUploader({ accept: ['csv'] });
            this.fUpload.render(this.s.dataFileUpload);
        },

        bindEventListeners: function() {
            log.info('{DATA} bindEventListeners');
            var self = this;
            $(this.s.btnFileUploader).on("click", function(e){
                e.stopPropagation();
                $('.dropdown-menu').toggle();
            });
            /*
            $(this.s.btnDelAllData).on('click', function() {
                console.log("btnDelAllData");
                var res = confirm(MultiLang[self.lang.toLowerCase()]['confirmDataRemove']);
                if (!res) return;
                Data.removeAllData();
                //RM.setDataEmpty();
            });
            */
            $(this.savebtn).on("click", function(){
                log.info("{DATA} saving", Data.getData());
                if (Data.getData()){ RM.setData(Data.getData()); }
                else { Notify["error"](MultiLang[self.lang.toLowerCase()]['invalidData']); }
            });

            //Data Merge
            $(this.s.btnDataMergeKeepNew).on('click', function () {
                self._CSVLoadedMergeData('keepNew');
            });
            $(this.s.btnDataMergeKeepOld).on('click', function () {
                self._CSVLoadedMergeData('keepOld');
            });
            $(this.s.btnDataMergeCancel).on('click', function () {
                self.tmpCsvData = null;
                self.tmpCsvCols = null;
                self._switchPanelVisibility(self.s.dataEditorContainer);
                $(self.s.utility).show();
            });

            this.listenTo(Backbone, "data:uploaded", function(str) {
                log.info("{DATA}[EVT] data:uploaded ");
                this.csvLoaded(str);
            });


        },

        unbindEventListeners: function(){
            $(this.s.btnDataMergeKeepNew).off("click");
            $(this.s.btnDataMergeKeepOld).off("click");
            $(this.s.btnDataMergeCancel).off("click");
            $(this.s.btnDelAllData).off("click");
            $(this.savebtn).off("click");
            $(this.s.btnCsvMatcherCancel).off("click");
            $(this.s.btnCsvMatcherOk).off("click");
        },

        _CSVLoadedCheckDuplicates: function () {
            log.info("_CSVLoadedCheckDuplicates")
            var data = Data.getDataWithoutValidation();
            var dv = new Data.Data_Validator();
            var keyDuplicates = dv.dataAppendCheck(Data.getColumns(), data, this.tmpCsvData);

            //this.tmpCsvData = csvData;
            if (keyDuplicates && keyDuplicates.length > 0) {
                this._switchPanelVisibility(this.s.dataUploadContainer);
            } else {
                this._CSVLoadedMergeData('keepNew');
            }
        },

        _CSVLoadedMergeData: function (keepOldOrNew) {
            log.info("_CSVLoadedMergeData",keepOldOrNew);
            var dv = new Data.Data_Validator();
            var data = Data.getDataWithoutValidation();

            var validator = new Data.Validator_CSV();

            var valRes = validator.validateCodes(Data.getColumns(), Data.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            log.info("uhm, variables",dv,data,validator,valRes);

            if (valRes && valRes.length > 0) {
                log.info("valRes got errors");
                for (var n = 0; n < valRes.length; n++) {
                    Notify["error"]([valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                }
            }
            //Validates the CSV contents
            var wrongDatatypes = dv.checkWrongDataTypes(Data.getColumns(), this.cLists, this.tmpCsvData);
            log.info("wrongDatatypes",wrongDatatypes);

            if (wrongDatatypes && wrongDatatypes.length > 0) {
                log.info("wrongDatatypes got errors");
                for (n = 0; n < wrongDatatypes.length; n++) {
                    Notify["error"]([wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                }
                //Don't merge, return.
                log.info("Don't merge, return.");
                this._switchPanelVisibility(this.s.dataEditorContainer);
                this.tmpCsvCols = null;
                this.tmpCsvData = null;
                return;
            }
            dv.dataMerge(Data.getColumns(), data, this.tmpCsvData, keepOldOrNew);
            Data.setData(data);
            this._switchPanelVisibility(this.s.dataEditorContainer);

            this.tmpCsvCols = null;
            this.tmpCsvData = null;

        },

        csvLoaded: function (data) {
            log.info('{DATA} csvLoaded', data);
            this.fUpload.reset();
            $(this.s.utility).hide();
            var conf = {};
            var self = this;
            var conv = new Data.CSV_To_Dataset(conf,$(this.s.csvSeparator).val());
            conv.convert(data);

            this.tmpCsvCols = conv.getColumns();
            this.tmpCsvData = conv.getData();

            var validator = new Data.Validator_CSV();
            console.log($('div#divCsvMatcher'));
            this.columnsMatch.render($('div#divCsvMatcher'));

            $(this.s.btnCsvMatcherOk).on("click", function() {
                self.tmpCsvCols = self.columnsMatch.getCsvCols();
                self.tmpCsvData = self.columnsMatch.getCsvData();
                self._CSVLoadedCheckDuplicates();

            });
            $(this.s.btnCsvMatcherCancel).on("click", function() {
                $(self.s.btnCsvMatcherCancel).off("click");
                $(self.s.btnCsvMatcherOk).off("click");
                self.tmpCsvData = null;
                self.tmpCsvCols = null;
                self._switchPanelVisibility( self.s.dataEditorContainer );
                $(self.s.utility).show();
            });


            //Validates the CSV structure (null columns, less columns than the DSD...)
            var valRes = validator.validate(Data.getColumns(), Data.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++) {
                    //console.log(MLRes.error, MLRes[valRes[n].type]);
                    Notify["error"](valRes[n].type);
                }
                return;
            }

            this._switchPanelVisibility( this.s.dataUploadColsMatch  )
            /*
            console.log("columnsmatch");
            console.log(JSON.stringify(RM.getDSDColumns()));
            console.log(JSON.stringify(this.tmpCsvCols));
            console.log(JSON.stringify(this.tmpCsvData));
            */
            this.columnsMatch.setData(RM.getDSD(), this.tmpCsvCols, this.tmpCsvData);

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

        _switchPanelVisibility: function (toShow) {
            $(this.s.dataUploadColsMatch).hide();
            $(this.s.dataEditorContainer).hide();
            $(this.s.dataUploadContainer).hide();
            $(toShow).show();
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
            $(this.s.utility).show();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DataView;

});