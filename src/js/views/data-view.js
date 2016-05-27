define([
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/data.hbs',
    'fx-DataEditor/start',
    'fx-DataMngCommons/js/Notifications',
    'fx-DataMngCommons/js/FileUploadHelper',
    'fx-DataEditor/js/DataEditor/helpers/CSV_To_Dataset',
    'fx-DataEditor/js/DataEditor/ColumnsMatch/ColumnsMatch',
    'fx-DataEditor/js/DataEditor/helpers/Data_Validator',
    'fx-DataEditor/js/DataEditor/helpers/Validator_CSV',
    'fx-DataEditor/js/DataEditor/helpers/Validator_CSV_Errors',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'chaplin',
    'amplify'
], function (View, template, DataEditor, Noti, FUploadHelper, CSVToDs, ColumnsMatch, DataValidator, CSV_Val, CSV_Val_Err, ResourceManager, MLRes, Chaplin) {
    'use strict';
    var h = {
        dataEditorMainContainer: "#DataEditorMainContainer",
        dataEditorContainer: "#DataEditorContainer",
        dataUploadContainer: "#DataUploadContainer",
        dataUploadColsMatch: "#DataUploadColsMatch",
        btnDelAllData: "#btnDelAllData",

        btnSaveData: "#dataEditEnd",
        //This was used before the CSV and the DSD matching was not handled in the UI, remove it if not needed anymore
        //btnGetCSVTemplate: "#btnGetCSVTemplate",

        btnDataMergeKeepNew: "#btnDataMergeKeepNew",
        btnDataMergeKeepOld: "#btnDataMergeKeepOld",
        btnDataMergeCancel: "#btnDataMergeCancel",

        btnCsvMatcherOk: "#btnCsvMatcherOk",
        btnCsvMatcherCancel: "#btnCsvMatcherCancel",

        dataFileUpload: "#dataFUpload",
        csvSeparator: "input[name=csvSeparator]:checked",

        divCsvMatcher: "#divCsvMatcher"

    };
    var _html = {
        spinner: '<i class="fa fa-spinner fa-spin"></i><i class="fa fa-circle-o-notch fa-spin"></i><i class="fa fa-refresh fa-spin"></i>'
    };

    var DataView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'data-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {
            var me = this;
            View.prototype.attach.call(this, arguments);

            this.$dataEditorContainer = $(h.dataEditorContainer);
            this.$dataUploadContainer = $(h.dataUploadContainer);
            this.$dataUploadColsMatch = $(h.dataUploadColsMatch);
            this._switchPanelVisibility(this.$dataEditorContainer);
            //FUpload
            this.fUpload = new FUploadHelper({ accept: ['csv'] });
            this.fUpload.render(h.dataFileUpload);
            // $(h.csvSeparator).val()
            //Columns match
            this.columnsMatch = new ColumnsMatch();
            this.columnsMatch.render($(h.divCsvMatcher));

            //btns
            this.$btnSave = $('#dataEditEnd');

            this.cLists;

            //helpers
            this.tmpCsvCols;
            this.tmpCsvData;

            var columns, data;
            this.resource = ResourceManager.getCurrentResource();
            if (!this.resource || !this.resource.metadata || !this.resource.metadata.dsd || !this.resource.metadata.dsd.columns)
                return;

            //columns = this.resource.metadata.dsd.columns;



            //Data Editor container
            var dataEditorMainContainerID = "#DataEditorMainContainer";
            var $dataEditorMainContainer = $("#DataEditorMainContainer");

            var loadDataSuccess = function () {
                //data = me.resource.data;
                me.resource = ResourceManager.getCurrentResource();
                data = ResourceManager.getCurrentResource().data;
                columns = ResourceManager.getCurrentResource().metadata.dsd.columns;

                ResourceManager.getCodelistsFromCurrentResource(function (cl) {
                    me.$btnSave.attr('disabled', 'disabled');
                    me.fUpload.enabled(false);
                    me.cLists = cl;
                    DataEditor.init(dataEditorMainContainerID, {},
                        function () {
                            DataEditor.setColumns(columns, cl);
                            DataEditor.setData(data);
                            me.$btnSave.removeAttr('disabled');
                            me.fUpload.enabled(true);
                        });
                },
                function () {
                    Noti.showError('', MLRes.errorLoadinResource + " [codelists]");
                    me.$btnSave.removeAttr('disabled');
                });
            };
            var loadDataError = function () {
                Noti.showError(MLRes.error, MLRes.errorLoadinResource);
                me.$btnSave.removeAttr('disabled');
                me.$btnSave.html(h);
            };
            ResourceManager.loadResource(this.resource, loadDataSuccess, loadDataError);


            this.bindEventListeners();
        },

        saveData: function () {
            var me = this;

            this.$btnSave.attr('disabled', 'disabled');
            var h = this.$btnSave.html();
            this.$btnSave.html(_html.spinner);
            var data = DataEditor.getData();

            //returns false if not valid
            if (data) {
                this.resource.metadata.dsd.columns = DataEditor.getColumnsWithDistincts();
                this.resource.data = data;

                //Noti.showError(MLRes.error, MLRes.errorLoadinResource);
                //Ajax error callbacks
                //Add "Error" as popup title
                var loadErr = function () {
                    Noti.showError(MLRes.error, MLRes.errorLoadinResource);
                    me.$btnSave.removeAttr('disabled');
                    me.$btnSave.html(h);
                };
                var putDataErr = function () {
                    Noti.showError(MLRes.error, MLRes.errorSavingResource + " (data)");
                    me.$btnSave.removeAttr('disabled');
                    me.$btnSave.html(h);
                };
                var putDSDErr = function () {
                    Noti.showError(MLRes.error, MLRes.errorSavingResource + " (DSD)");
                    me.$btnSave.removeAttr('disabled');
                    me.$btnSave.html(h);
                };
                //Ajax success callbacks
                var loadSucc = function () {
                    me.$btnSave.removeAttr('disabled');
                    me.$btnSave.html(h);
                    // data#show
                    Chaplin.utils.redirectTo('landing#show');
                };

                //if updateDSD is ok, reload the saved resource
                var updateDSDSucc = function () {
                    ResourceManager.loadResource(me.resource, loadSucc, loadErr);
                };
                //If putData is ok update the DSD (values' distinct).
                var putDataSucc = function () {
                    ResourceManager.updateDSD(me.resource, updateDSDSucc, putDSDErr);
                    Noti.showSuccess(MLRes.success, MLRes.resourceSaved)
                };
                //Start the save process: putData->UpdateDSD->Reload
                ResourceManager.putData(this.resource, putDataSucc, putDSDErr);
            }
                //data is not valid
            else {
                Noti.showError(MLRes.error, MLRes.errorParsingJson);
                Noti.showError(MLRes.error, MLRes.invalidData);
                me.$btnSave.removeAttr('disabled');
                me.$btnSave.html(h);
            }
        },

        ////This was used before the CSV and the DSD matching was not handled in the UI, remove it if not needed anymore
        /*_getCSVTemplate: function () {
            var cols = this.resource.metadata.dsd.columns;
            var toRet = "";
            for (var i = 0; i < cols.length; i++) {
                toRet += cols[i].id;
                if (i != cols.length - 1)
                    toRet += ",";
            }
            var dLink = document.createElement('a');
            dLink.download = 'dataTemplate.csv';
            dLink.innerHTML = "Download file";
            var textFileAsBlob = new Blob([toRet], { type: 'text/plain' });
            dLink.href = window.URL.createObjectURL(textFileAsBlob);
            dLink.onclick = function (evt) { document.body.removeChild(dLink); };
            dLink.style.display = 'none';
            document.body.appendChild(dLink);
            dLink.click();
        },*/

        _CSVLoaded: function (data) {
            this.fUpload.reset();
            var conf = {};
            var conv = new CSVToDs(conf,$(h.csvSeparator).val());
            conv.convert(data);


            this.tmpCsvCols = conv.getColumns();
            this.tmpCsvData = conv.getData();

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
        _showCSvColumnMatcher: function () {
            this._switchPanelVisibility(this.$dataUploadColsMatch);
        },
        _CSVLoadedCheckDuplicates: function () {
            var data = DataEditor.getDataWithoutValidation();
            var dv = new DataValidator();

            var keyDuplicates = dv.dataAppendCheck(DataEditor.getColumns(), data, this.tmpCsvData);

            //this.tmpCsvData = csvData;
            if (keyDuplicates && keyDuplicates.length > 0) {
                this._CSVLoadedShowMergeMode();
            }
            else {
                this._CSVLoadedMergeData('keepNew');
            }
        },
        _CSVLoadedShowMergeMode: function () {
            this._switchPanelVisibility(this.$dataUploadContainer);
        },

        _CSVLoadedMergeData: function (keepOldOrNew) {
            var dv = new DataValidator();
            var data = DataEditor.getDataWithoutValidation();

            var valRes = CSV_Val.validateCodes(DataEditor.getColumns(), DataEditor.getCodelists(), this.tmpCsvCols, this.tmpCsvData);
            if (valRes && valRes.length > 0) {
                //CSV_Val.removeUnknownCodes(DataEditor.getColumns(), DataEditor.getCodelists(), this.tmpCsvCols, this.tmpCsvData);
                for (var n = 0; n < valRes.length; n++) {
                    Noti.showError(MLRes.error, MLRes[valRes[n].type] + ". - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                }
            }
            //Validates the CSV contents
            var wrongDatatypes = dv.checkWrongDataTypes(DataEditor.getColumns(), this.cLists, this.tmpCsvData);

            if (wrongDatatypes && wrongDatatypes.length > 0) {
                for (n = 0; n < wrongDatatypes.length; n++) {
                    Noti.showError(MLRes.error, MLRes[wrongDatatypes[n].error] + " - CSV Row: " + wrongDatatypes[n].dataIndex);
                }
                //Don't merge, return.
                this._switchPanelVisibility(this.$dataEditorContainer);
                this.tmpCsvCols = null;
                this.tmpCsvData = null;
                return;
            }

            dv.dataMerge(DataEditor.getColumns(), data, this.tmpCsvData, keepOldOrNew);
            DataEditor.setData(data);
            this._switchPanelVisibility(this.$dataEditorContainer);

            this.tmpCsvCols = null;
            this.tmpCsvData = null;
        },

        _switchPanelVisibility: function (toShow) {
            var id = toShow.attr("id");
            if (id == this.$dataEditorContainer[0].id)
                this.$dataEditorContainer.show();
            else
                this.$dataEditorContainer.hide();
            if (id == this.$dataUploadContainer[0].id)
                this.$dataUploadContainer.show();
            else
                this.$dataUploadContainer.hide();
            if (id == this.$dataUploadColsMatch[0].id)
                this.$dataUploadColsMatch.show();
            else
                this.$dataUploadColsMatch.hide();
        },

        bindEventListeners: function () {
            var me = this;
            $(h.btnSaveData).on('click', function () { me.saveData(); });
            //This was used before the CSV and the DSD matching was not handled in the UI, remove it if not needed anymore
            //$(h.btnGetCSVTemplate).on('click', function () { me._getCSVTemplate(); });

            $(h.btnDelAllData).on('click', function () {
                var res = confirm(MLRes.confirmDataRemove);
                if (!res)
                    return;
                DataEditor.removeAllData();
            });

            //Data Merge
            $(h.btnDataMergeKeepNew).on('click', function () {
                me._CSVLoadedMergeData('keepNew');
            });
            $(h.btnDataMergeKeepOld).on('click', function () {
                me._CSVLoadedMergeData('keepOld');
            });
            $(h.btnDataMergeCancel).on('click', function () {
                me.tmpCsvData = null;
                me.tmpCsvCols = null;
                me._switchPanelVisibility(me.$dataEditorContainer);
            });

            //CSV matcher
            $(h.btnCsvMatcherOk).on('click', function () {
                me.tmpCsvCols = me.columnsMatch.getCsvCols();
                me.tmpCsvData = me.columnsMatch.getCsvData();

                me._CSVLoadedCheckDuplicates();
            });
            $(h.btnCsvMatcherCancel).on('click', function () {
                me.tmpCsvData = null;
                me.tmpCsvCols = null;
                me._switchPanelVisibility(me.$dataEditorContainer);
            });
            //FUpload
            amplify.subscribe('textFileUploaded.FileUploadHelper.fenix', this, this._CSVLoaded);
        },
        unbindEventListeners: function () {
            $(h.btnSaveData).off('click');
            //This was used before the CSV and the DSD matching was not handled in the UI, remove it if not needed anymore
            //$(h.btnGetCSVTemplate).off('click');
            $(h.btnDelAllData).off('click');
            $(h.btnDataMergeKeepNew).off('click');
            $(h.btnDataMergeKeepOld).off('click');
            $(h.btnDataMergeCancel).off('click');

            $(h.btnCsvMatcherOk).off('click');
            $(h.btnCsvMatcherCancel).off('click');

            amplify.unsubscribe('textFileUploaded.FileUploadHelper.fenix', this._CSVLoaded);
        },

        dispose: function () {
            DataEditor.destroy();
            this.unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }
    });

    return DataView;
});
