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
            var columns = [
                     {
                         "dataType": "code",
                         "key": true,
                         "id": "CODE",
                         "title": {
                             "EN": "Item"
                         },
                         "domain": {
                             "codes": [
                                 {
                                     "idCodeList": "FAOSTAT_CommodityList"
                                 }
                             ]
                         },
                         "subject": "item"
                     },
                     {
                         "dataType": "number",
                         "key": false,
                         "id": "NUMBER",
                         "title": {
                             "EN": "Val"
                         },
                         "subject": "value"
                     }
            ];

            var data = [["0015", 1], ["0019", 2], ["0023", 3], ['0031', 4]];
            var cLists;
            ResourceManager.getCodelists([{ uid: 'FAOSTAT_CommodityList' }], function (cl) {
                DataEditor.init(h.dataEditorContainer, {}, function () {
                    DataEditor.setColumns(columns, cl, function () {
                        DataEditor.setData(data);
                    });
                });
            }, function (uids) {
                alert('ERROR retrieving the codelsits ' + uids.toString());
            });

            //FUpload
            this.fUpload = new FUploadHelper({ accept: ['csv'] });
            this.fUpload.render('#dataFUpload');

            /*var columns, data, cLists;
            this.resource = ResourceManager.getCurrentResource();
            if (!this.resource || !this.resource.metadata || !this.resource.metadata.dsd || !this.resource.metadata.dsd.columns)
                return;
            columns = this.resource.metadata.dsd.columns;
            data = this.resource.data;

            //Data Editor container
            var dataEditorContainerID = "#DataEditorMainContainer";
            var $dataEditorContainer = $("#DataEditorMainContainer");

            var me = this;
            ResourceManager.getCodelistsFromCurrentResource(function (cl) {
                cLists = cl;
                DataEditor.init(dataEditorContainerID, {},
                    function () {
                        DataEditor.setColumns(columns, cl);
                        DataEditor.setData(data);
                    });
            },
            function () {
                Noti.showError('',MLRes.errorLoadinResource + " [codelists]");
            });*/

            this.bindEventListeners();
        },

        bindEventListeners: function () {
            var me = this;
            $('#dataEditEnd').on('click', me.saveData);

            //FUpload
            amplify.subscribe('textFileUploaded.FileUploadHelper.fenix', this, this._CSVLoaded);
        },

        saveData: function () {
            var $btnSave = $('#dataEditEnd');

            $btnSave.attr('disabled', 'disabled');
            var data = DataEditor.getData();
            //returns false if not valid
            if (data) {
                me.resource.metadata.dsd.columns = DataEditor.getColumnsWithDistincts();
                me.resource.data = data;

                //Noti.showError(MLRes.error, MLRes.errorLoadinResource);
                //Ajax error callbacks
                //Add "Error" as popup title
                var loadErr = function () { Noti.showError('', MLRes.errorLoadinResource); };
                var putDataErr = function () { Noti.showError('', MLRes.errorSavingResource + " (data)"); };
                var putDSDErr = function () { Noti.showError('', MLRes.errorSavingResource + " (DSD)"); };
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
                ResourceManager.putData(me.resource, putDataSucc, putDSDErr);
            }
                //data is not valid
            else {
                Noti.showError('', '__Data is not valid');
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
                Noti.showError('', '__NOTIFY val res!');
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
