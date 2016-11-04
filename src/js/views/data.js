define([
    "jquery",
    "backbone",
    "loglevel",
    "q",

    "fenix-ui-DataEditor",
    "../../config/data-editor",

    "../components/file-uploader",
    "../../html/file-uploader.hbs",
],function($, Backbone, log, Q, Data, Config, FileUploader, TemplateFU){

    "use strict";

    var s = {
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

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial:o});

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("{Data} Rendering View");
                this._initViews();
                this._initFileUploader();
                this._bindEventListeners();

            } else {
                log.error("Impossible to render Landing");
                log.error(valid)
            }
            log.info("{SOME} Rendering View", this);

            return this;
        },

        _parseInput: function () {

            this.$container = $(this.initial.container);
            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
            this.cLists = this.initial.codelists;
            this.dsd = this.initial.dsd;
            this.data = this.initial.data;
            this.$savebtn = $(this.initial.savebtn);
            this.generator = this.initial.generator;

        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$container.length === 0) {
                errors.push({code: ERR.MISSING_CONTAINER});
                log.warn("Impossible to find container");
            }
            //Check if $savebtn is visible
            if (!this.$savebtn.is(":visible")){
                errors.push({code: ERR.MISSING_BUTTONS});
                log.warn("Impossible to find save buttons");
            }

            return errors.length > 0 ? errors : valid;
        },

        _initViews: function() {
            log.info("{Data} initViews", Config);
            var config = Config;
            var self = this;

            $(s.utility).html(TemplateFU);

            this.$dataUploadColsMatch = $(this.$container.find(s.dataUploadColsMatch));
            this.$dataEditorContainer = $(this.$container.find(s.dataEditorContainer));
            this.$dataUploadContainer = $(this.$container.find(s.dataUploadContainer));

            this.columnsMatch = new Data.Columns_Match();

            Data.init(this.$container, config, null);
            log.info('{Data} Calling the Codelists');
            this.generator.then (function (result) {
                log.info('{Data} Calling the DSD');//, result);
                var dsd = self.dsd.columns;
                log.info('{Data} Setting the DSD...');//, dsd);
                Data.setColumns(dsd, result, null);
                log.info("{Data} DSD Columns Setted.");//, self.data);
                if (self.data !== undefined) Data.setData(self.data);
            })

        },

        _initFileUploader: function() {
            this.fUpload = new FileUploader({ accept: ['csv'] });
            this.fUpload.render(this.$container.find(s.dataFileUpload));
        },

        _bindEventListeners: function() {
            log.info('{Data} _bindEventListeners');
            var self = this;
            $(this.$container.find(s.btnFileUploader)).on("click", function(e){
                e.stopPropagation();
                $(s.utility).find('.dropdown-menu').toggle();
            });

            $(this.$savebtn).on("click", function(){
                log.info("{DATA} saving", Data.getData());
                if (Data.getData()) Backbone.trigger("data:saving", Data.getData());
            });

            //Data Merge
            $(this.$container.find(s.btnDataMergeKeepNew)).on('click', function () {
                self._CSVLoadedMergeData('keepNew');
            });
            $(this.$container.find(s.btnDataMergeKeepOld)).on('click', function () {
                self._CSVLoadedMergeData('keepOld');
            });
            $(this.$container.find(s.btnDataMergeCancel)).on('click', function () {
                self.tmpCsvData = null;
                self.tmpCsvCols = null;
                self._switchPanelVisibility(self.s.dataEditorContainer);
                $(self.s.utility).show();
            });

            this.listenTo(Backbone, "data:uploaded", function(str) {
                log.info("{DATA}[EVT] data:uploaded ");
                self._csvLoaded(str);
            });


        },

        _removeEventListeners: function(){
            $(this.$container.find(s.btnDataMergeKeepNew)).off("click");
            $(this.$container.find(s.btnDataMergeKeepOld)).off("click");
            $(this.$container.find(s.btnDataMergeCancel)).off("click");
            $(this.$container.find(s.btnDelAllData)).off("click");
            $(this.$container.find(s.savebtn)).off("click");
            $(this.$container.find(s.btnCsvMatcherCancel)).off("click");
            $(this.$container.find(s.btnCsvMatcherOk)).off("click");
        },

        _CSVLoadedCheckDuplicates: function () {
            log.info("_CSVLoadedCheckDuplicates")
            var data = Data.getDataWithoutValidation();
            var dv = new Data.Data_Validator();
            var keyDuplicates = dv.dataAppendCheck(Data.getColumns(), data, this.tmpCsvData);

            //this.tmpCsvData = csvData;
            if (keyDuplicates && keyDuplicates.length > 0) {
                this._switchPanelVisibility(s.dataUploadContainer);
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
                    Backbone.trigger("error:showerrormsg", [valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                }
            }
            //Validates the CSV contents
            var wrongDatatypes = dv.checkWrongDataTypes(Data.getColumns(), this.cLists, this.tmpCsvData);
            log.info("wrongDatatypes",wrongDatatypes);

            if (wrongDatatypes && wrongDatatypes.length > 0) {
                log.info("wrongDatatypes got errors");
                for (n = 0; n < wrongDatatypes.length; n++) {
                    Backbone.trigger("error:showerrormsg",[wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
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

        _csvLoaded: function (data) {
            log.info('{DATA} csvLoaded', data);
            this.fUpload.reset();
            $(s.utility).hide();
            var conf = {};
            var self = this;
            var conv = new Data.CSV_To_Dataset(conf,$(s.csvSeparator).val());
            conv.convert(data);

            this.tmpCsvCols = conv.getColumns();
            this.tmpCsvData = conv.getData();

            var validator = new Data.Validator_CSV();
            this.columnsMatch.render($('div#divCsvMatcher'));

            $(s.btnCsvMatcherOk).on("click", function() {
                self.tmpCsvCols = self.columnsMatch.getCsvCols();
                self.tmpCsvData = self.columnsMatch.getCsvData();
                self._CSVLoadedCheckDuplicates();

            });
            $(s.btnCsvMatcherCancel).on("click", function() {
                $(s.btnCsvMatcherCancel).off("click");
                $(s.btnCsvMatcherOk).off("click");
                self.tmpCsvData = null;
                self.tmpCsvCols = null;
                self._switchPanelVisibility( self.s.dataEditorContainer );
                $(s.utility).show();
            });


            //Validates the CSV structure (null columns, less columns than the DSD...)
            var valRes = validator.validate(Data.getColumns(), Data.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++) {
                    //console.log(MLRes.error, MLRes[valRes[n].type]);
                    Backbone.trigger("error:showerrormsg",valRes[n].type);
                }
                return;
            }

            this._switchPanelVisibility( s.dataUploadColsMatch  )
            this.columnsMatch.setData(this.dsd, this.tmpCsvCols, this.tmpCsvData);

            //Validates the CSV contents
            var dv = new Data.Data_Validator();
            var wrongDatatypes = dv.checkWrongDataTypes(Data.getColumns(), this.cLists, this.tmpCsvData);

             if (wrongDatatypes && wrongDatatypes.length > 0) {
                 for (n = 0; n < wrongDatatypes.length; n++) {
                     Backbone.trigger("error:showerrormsg",[wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                 }
                 return;
             }


        },

        _switchPanelVisibility: function (toShow) {
            $(s.dataUploadColsMatch).hide();
            $(s.dataEditorContainer).hide();
            $(s.dataUploadContainer).hide();
            $(toShow).show();
        },

        accessControl: function (Resource) {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(Resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function() {
            log.warn("{DATA} - Remove View");
            this._removeEventListeners();
            $(s.utility).html('');
            $(s.utility).show();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DataView;

});