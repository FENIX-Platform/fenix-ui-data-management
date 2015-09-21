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
        dataEditorContainer: "#DataEditorMainContainer"
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

        bindEventListeners: function () {
            var me = this;
            $('#dataEditEnd').on('click', function () { me.saveData(); });

            //FUpload
            amplify.subscribe('textFileUploaded.FileUploadHelper.fenix', this, this._CSVLoaded);
        },

        saveData: function () {
            var me = this;

            var $btnSave = $('#dataEditEnd');
            $btnSave.attr('disabled', 'disabled');
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

        _CSVLoaded: function (data) {
            this.fUpload.reset();
            var conv = new CSVToDs();
            conv.convert(data);

            var csvCols = conv.getColumns();
            var csvData = conv.getData();

            var valRes = CSV_Val.validate(DataEditor.getColumns(), csvCols, csvData);

            if (valRes && valRes.length > 0) {
                for (var n = 0; n < valRes.length; n++)
                    Noti.showError(MLRes.error, MLRes[valRes[n].type]);
                return;
            }
            DataEditor.appendData(csvData);
        },
        unbindEventListeners: function () {
            $('#dataEditEnd').off();
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
