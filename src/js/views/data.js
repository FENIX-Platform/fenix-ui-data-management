define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DataEditor",
    "../../config/data-editor",
    "../components/file-uploader",
    '../../nls/labels',
    "../../html/data.hbs",
    "../../html/file-uploader.hbs"
], function ($, Backbone, log, Q, DataEditor, Config, FileUploader, labels, template, templateFileUploader) {

    "use strict";

    var rowlimit = null;

    var s = {
        SAVE_BUTTON: "[data-role='save']",
        KEEP_NEW_DATA_BUTTON: "[data-role='keep-new']",
        KEEP_OLD_DATA_BUTTON: "[data-role='keep-old']",
        ABORT_MERGE_BUTTON: "[data-role='abort-merge']",
        CSV_MATCHER_OK: "[data-role='csv-matcher-ok']",
        CSV_MATCHER_CANCEL: "[data-role='csv-matcher-cancel']",


        utility: '#fx-data-management-utility-holder',
        btnFileUploader: "#btnFileUploader",
        btnDelAllData: "#btnDelAllData",
        dataFileUpload: "#dataFUpload",
        csvSeparator: "input[name=csvSeparator]:checked",
        dataUploadColsMatch: "#DataUploadColsMatch",
        dataEditorContainer: "#divDataEditor",
        dataUploadContainer: "#DataUploadContainer",
        divCsvMatcher: "#divCsvMatcher",
        btnCsvMatcherOk: "#btnCsvMatcherOk",
        btnCsvMatcherCancel: "#btnCsvMatcherCancel",
        btnDataMergeKeepNew: "#btnDataMergeKeepNew",
        btnDataMergeKeepOld: "#btnDataMergeKeepOld",
        btnDataMergeCancel: "#btnDataMergeCancel"
    };

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("{Data} Rendering View");

                this._attach();

                this._initVariables();

                this._initViews();

                this._initFileUploader();

                this._bindEventListeners();

            } else {
                log.error("Impossible to render Landing");
                log.error(valid)
            }
            log.info("{Data} Rendering View", this);

            return this;
        },

        _parseInput: function () {

            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
            this.cLists = this.initial.codelists;
            this.dsd = this.initial.dsd;
            this.data = this.initial.data;
            this.generator = this.initial.generator;
        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            return errors.length > 0 ? errors : valid;
        },

        _attach: function () {
            this.$el.html(template(labels)); //TODO i18n
        },

        _initVariables: function () {

            this.$savebtn = this.$el.find(s.SAVE_BUTTON);
            this.$keepNewDataButton = this.$el.find(s.KEEP_NEW_DATA_BUTTON);
            this.$keepOldDataButton = this.$el.find(s.KEEP_OLD_DATA_BUTTON);
            this.$abortMergeButton = this.$el.find(s.ABORT_MERGE_BUTTON);
            this.$csvMatcherOkButton = this.$el.find(s.CSV_MATCHER_OK);
            this.$csvMatcherCancelButton = this.$el.find(s.CSV_MATCHER_CANCEL);
        },

        _initViews: function () {
            log.info("{Data} initViews", Config);

            var config = Config,
                self = this;

            $(s.utility).html(templateFileUploader);

            this.$dataUploadColsMatch = $(this.$container.find(s.dataUploadColsMatch));
            this.$dataEditorContainer = $(this.$container.find(s.dataEditorContainer));
            this.$dataUploadContainer = $(this.$container.find(s.dataUploadContainer));

            this.$dataEditorContainer.hide();

            this.columnsMatch = new DataEditor.Columns_Match();

            DataEditor.init(this.$container, config, null);
            log.info('{Data} Calling the Codelists');

            this.generator.then(function (result) {
                //Data.isEditable(false);
                log.info('{Data} Calling the DSD');//, result);
                var dsd = self.dsd.columns;
                log.info('{Data} Setting the DSD...');//, dsd);
                DataEditor.setColumns(dsd, result, null);
                log.info("{Data} DSD Columns Setted.");//, self.data);
                if (self.data !== undefined) DataEditor.setData(self.data, rowlimit);
                log.info("{Data} But not the data!");
            })

        },

        _initFileUploader: function () {
            this.fUpload = new FileUploader({accept: ['csv']});
            this.fUpload.render(s.dataFileUpload);
        },

        _bindEventListeners: function () {
            log.info('{Data} _bindEventListeners');
            var self = this;

            this.$savebtn.on("click", function () {
                log.info("{DATA} saving", DataEditor.getData());
                if (DataEditor.getData()) Backbone.trigger("data:saving", Data.getData());
            });

            //Data Merge
            this.$keepNewDataButton.on('click', function () {
                self._CSVLoadedMergeData('keepNew');
            });

            this.$keepOldDataButton.on('click', function () {
                self._CSVLoadedMergeData('keepOld');
            });

            this.$abortMergeButton.on('click', function () {
                self.tmpCsvData = null;
                self.tmpCsvCols = null;
                self._switchPanelVisibility($(self.$container.find(s.dataEditorContainer)));
                $(s.utility).show();
            });

            this.listenTo(Backbone, "data:uploaded", function (str) {
                log.info("{DATA}[EVT] data:uploaded ");
                self._csvLoaded(str);
            });
        },

        _removeEventListeners: function () {

            this.$savebtn.off();
            this.$keepNewDataButton.off();
            this.$keepOldDataButton.off();
            this.$abortMergeButton.off();

            this.$csvMatcherOkButton.off();
            this.$csvMatcherCancelButton.off();

        },

        _CSVLoadedCheckDuplicates: function () {
            log.info("_CSVLoadedCheckDuplicates")
            var data = DataEditor.getDataWithoutValidation();
            var dv = new DataEditor.Data_Validator();
            var keyDuplicates = dv.dataAppendCheck(DataEditor.getColumns(), data, this.tmpCsvData);

            //this.tmpCsvData = csvData;
            if (keyDuplicates && keyDuplicates.length > 0) {
                this._switchPanelVisibility($(this.$container.find(s.dataUploadContainer)));
            } else {
                this._CSVLoadedMergeData('keepNew');
            }
        },

        _CSVLoadedMergeData: function (keepOldOrNew) {
            log.info("_CSVLoadedMergeData", keepOldOrNew);
            var dv = new DataEditor.Data_Validator();
            var data = DataEditor.getDataWithoutValidation();

            var validator = new DataEditor.Validator_CSV();

            var valRes = validator.validateCodes(DataEditor.getColumns(), DataEditor.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            log.info("uhm, variables", dv, data, validator, valRes);

            if (valRes && valRes.length > 0) {
                log.info("valRes got errors");
                for (var n = 0; n < valRes.length; n++) {
                    Backbone.trigger("error:showerrormsg", [valRes[n].type] + " - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                }
            }
            //Validates the CSV contents
            var wrongDatatypes = dv.checkWrongDataTypes(DataEditor.getColumns(), this.cLists, this.tmpCsvData);
            log.info("wrongDatatypes", wrongDatatypes);

            if (wrongDatatypes && wrongDatatypes.length > 0) {
                log.info("wrongDatatypes got errors");
                for (n = 0; n < wrongDatatypes.length; n++) {
                    Backbone.trigger("error:showerrormsg", [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                }
                //Don't merge, return.
                log.info("Don't merge, return.");
                this._switchPanelVisibility($(this.$container.find(s.dataEditorContainer)));
                this.tmpCsvCols = null;
                this.tmpCsvf = null;
                return;
            }
            dv.dataMerge(DataEditor.getColumns(), data, this.tmpCsvData, keepOldOrNew);
            DataEditor.setData(data, rowlimit);
//            DataEditor.isEditable(false);
            this._switchPanelVisibility($(this.$container.find(s.dataEditorContainer)));
            Backbone.trigger("data:loaded");

            this.tmpCsvCols = null;
            this.tmpCsvData = null;

        },

        _csvLoaded: function (data) {
            log.info('{DATA} csvLoaded', data);
            this.fUpload.reset();
            $(s.utility).hide();
            var conf = {};
            var self = this;
            var conv = new DataEditor.CSV_To_Dataset(conf, $(s.csvSeparator).val());
            conv.convert(data);

            this.tmpCsvCols = conv.getColumns();
            this.tmpCsvData = conv.getData();

            var validator = new DataEditor.Validator_CSV();
            this.columnsMatch.render($('div#divCsvMatcher'));

            this.$csvMatcherOkButton.on("click", function () {
                self.tmpCsvCols = self.columnsMatch.getCsvCols();
                self.tmpCsvData = self.columnsMatch.getCsvData();
                self._CSVLoadedCheckDuplicates();

            });
            this.$csvMatcherCancelButton.on("click", function () {
                $(s.btnCsvMatcherCancel).off("click");
                $(s.btnCsvMatcherOk).off("click");
                self.tmpCsvData = null;
                self.tmpCsvCols = null;
                self._switchPanelVisibility($(self.$container.find(s.dataEditorContainer)));
                $(s.utility).show();
            });


            //Validates the CSV structure (null columns, less columns than the DSD...)
            var valRes = validator.validate(DataEditor.getColumns(), DataEditor.getCodelists(), this.tmpCsvCols, this.tmpCsvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++) {
                    //console.log(MLRes.error, MLRes[valRes[n].type]);
                    Backbone.trigger("error:showerrormsg", valRes[n].type);
                }
                return;
            }

            this._switchPanelVisibility($(this.$container.find(s.dataUploadColsMatch)));

            this.columnsMatch.setData(this.dsd, this.tmpCsvCols, this.tmpCsvData);

            //Validates the CSV contents
            var dv = new DataEditor.Data_Validator();
            var wrongDatatypes = dv.checkWrongDataTypes(DataEditor.getColumns(), this.cLists, this.tmpCsvData);

            if (wrongDatatypes && wrongDatatypes.length > 0) {
                for (n = 0; n < wrongDatatypes.length; n++) {
                    Backbone.trigger("error:showerrormsg", [wrongDatatypes[n].error] + " - Row: " + wrongDatatypes[n].dataIndex);
                }
                return;
            }

        },

        _switchPanelVisibility: function (toShow) {
            $(this.$container.find(s.dataUploadColsMatch)).hide();
            $(this.$container.find(s.dataEditorContainer)).hide();
            $(this.$container.find(s.dataUploadContainer)).hide();
            toShow.show();
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

        remove: function () {
            log.warn("{DATA} - Remove View");
            this._removeEventListeners();
            $(s.utility).html('');
            $(s.utility).show();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DataView;

});