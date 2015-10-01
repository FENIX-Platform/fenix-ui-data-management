define([
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/data.hbs',
    'fx-DataEditor/start',
    'fx-DSDEditor/js/dataManagementCommons/Notifications',
    'fx-DSDEditor/js/dataManagementCommons/FileUploadHelper',
    'fx-DataEditor/js/DataEditor/helpers/CSV_To_Dataset',
    'fx-DataEditor/js/DataEditor/helpers/Validator_CSV',
    'fx-DataEditor/js/DataEditor/helpers/Validator_CSV_Errors',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'chaplin',
    'amplify'
], function (View, template, DataEditor, Noti, FUploadHelper, CSVToDs, CSV_Val, CSV_Val_Err, ResourceManager, MLRes, Chaplin) {
    'use strict';
    var h = {
        dataEditorContainer: "#DataEditorMainContainer",
        btnDelAllData: "#btnDelAllData",

        btnSaveData: "#dataEditEnd",
        btnGetCSVTemplate: "#btnGetCSVTemplate"
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
            View.prototype.attach.call(this, arguments);

            var $dataEditorContainer = $(h.dataEditorContainer);
            //FUpload
            this.fUpload = new FUploadHelper({ accept: ['csv'] });
            this.fUpload.render('#dataFUpload');

            var columns, data, cLists;
            this.resource = ResourceManager.getCurrentResource();
            if (!this.resource || !this.resource.metadata || !this.resource.metadata.dsd || !this.resource.metadata.dsd.columns)
                return;
            columns = this.resource.metadata.dsd.columns;
            data = this.resource.data;

            //Data Editor container
            var dataEditorContainerID = "#DataEditorMainContainer";
            var $dataEditorContainer = $("#DataEditorMainContainer");

            //var me = this;
            ResourceManager.getCodelistsFromCurrentResource(function (cl) {
                cLists = cl;
                DataEditor.init(dataEditorContainerID, {},
                    function () {
                        DataEditor.setColumns(columns, cl);
                        DataEditor.setData(data);
                    });
            },
            function () {
                Noti.showError('', MLRes.errorLoadinResource + " [codelists]");
            });

            this.bindEventListeners();
        },

        saveData: function () {
            var me = this;

            var $btnSave = $('#dataEditEnd');
            $btnSave.attr('disabled', 'disabled');
            var h = $btnSave.html();
            $btnSave.html(_html.spinner);
            var data = DataEditor.getData();
            //returns false if not valid
            if (data) {
                this.resource.metadata.dsd.columns = DataEditor.getColumnsWithDistincts();
                this.resource.data = data;

                //Noti.showError(MLRes.error, MLRes.errorLoadinResource);
                //Ajax error callbacks
                //Add "Error" as popup title
                var loadErr = function () { Noti.showError(MLRes.error, MLRes.errorLoadinResource); };
                var putDataErr = function () { Noti.showError(MLRes.error, MLRes.errorSavingResource + " (data)"); };
                var putDSDErr = function () { Noti.showError(MLRes.error, MLRes.errorSavingResource + " (DSD)"); };
                //Ajax success callbacks
                var loadSucc = function () {
                    $btnSave.removeAttr('disabled');
                    $btnSave.html(h);
                    Chaplin.utils.redirectTo('data#show');
                };

                //if updateDSD is ok, reload the saved resource
                var updateDSDSucc = function () {
                    ResourceManager.loadResource(me.resource, loadSucc, loadErr);
                };
                //If putData is ok update the DSD (values' distinct).
                var putDataSucc = function () {
                    ResourceManager.updateDSD(me.resource, updateDSDSucc, putDSDErr);
                };
                //Start the save process: putData->UpdateDSD->Reload
                ResourceManager.putData(this.resource, putDataSucc, putDSDErr);
            }
                //data is not valid
            else {

                Noti.showError(MLRes.error, MLRes.errorParsingJson);
                Noti.showError(MLRes.error, MLRes.invalidData);
            }
        },

        _getCSVTemplate: function () {
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
        },

        _CSVLoaded: function (data) {
            this.fUpload.reset();
            var conv = new CSVToDs();
            conv.convert(data);

            var csvCols = conv.getColumns();
            var csvData = conv.getData();

            var valRes = CSV_Val.validate(DataEditor.getColumns(), DataEditor.getCodelists(), csvCols, csvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++) {
                    if (valRes[n].type == 'unknownCodes') {
                        Noti.showError(MLRes.error, MLRes[valRes[n].type] + ". - codelist: " + valRes[n].codelistId + " - codes: " + valRes[n].codes.join(','));
                    }
                    else {
                        Noti.showError(MLRes.error, MLRes[valRes[n].type]);
                    }
                }
                return;
            }
            DataEditor.appendData(csvData);
        },

        bindEventListeners: function () {
            var me = this;
            $(h.btnSaveData).on('click', function () { me.saveData(); });
            $(h.btnGetCSVTemplate).on('click', function () { me._getCSVTemplate(); });

            $(h.btnDelAllData).on('click', function () {
                var res = confirm(MLRes.confirmDataRemove);
                if (!res)
                    return;
                DataEditor.removeAllData();
            });

            //FUpload
            amplify.subscribe('textFileUploaded.FileUploadHelper.fenix', this, this._CSVLoaded);
        },
        unbindEventListeners: function () {
            $(h.btnSaveData).off('click');
            $(h.btnGetCSVTemplate).off('click');
            $(h.btnDelAllData).off('click');
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
