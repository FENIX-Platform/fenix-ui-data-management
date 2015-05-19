define([
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/data.hbs',
    'fx-DataEditor/start',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'chaplin',
    'pnotify'
], function (View, template, DataEditor, ResourceManager, MLRes, Chaplin) {
    'use strict';

    /*
    Change check
    if (DataEditor.hasChanged()) {
                    if (!confirm(MLRes.unsavedWarning))
                        return;
                }
                */

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

            var columns, data, cLists;
            this.resource = ResourceManager.getCurrentResource();
            if (!this.resource || !this.resource.metadata || !this.resource.metadata.dsd || !this.resource.metadata.dsd.columns)
                return;
            columns = this.resource.metadata.dsd.columns;
            data = this.resource.data;

            this.bindEventListeners();
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
                new PNotify({ title: '', text: MLRes.errorLoadinResource + " [codelists]", type: 'error' });
            });
        },

        bindEventListeners: function () {
            var me = this;
            var $btnSave = $('#dataEditEnd');
            $btnSave.on("click", function () {
                $btnSave.attr('disabled', 'disabled');
                var data = DataEditor.getData();
                //returns false if not valid
                if (data) {
                    var colDist = DataEditor.getColumnsWithDistincts();

                    me.resource.metadata.dsd.columns = colDist;
                    me.resource.data = data;

                    //Ajax error callbacks
                    var loadErr = function () { new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' }); };
                    var putDataErr = function () { new PNotify({ title: '', text: MLRes.errorSavingResource + " (data)", type: 'error' }); };
                    var putDSDErr = function () { new PNotify({ title: '', text: MLRes.errorSavingResource + " (DSD)", type: 'error' }); };
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


                    /*ResourceManager.putData(me.resource,
                        ResourceManager.updateDSD(me.resource, function () {
                            ResourceManager.loadResource(me.resource, succ, err);
                        })
                    );*/
                }
                    //data is not valid
                else {
                    new PNotify({
                        title: '',
                        text: '__Data is not valid',
                        type: 'error'
                    });
                }
            });
        },

        unbindEventListeners: function () {
            $('#dataEditEnd').off();
        },

        dispose: function () {

            DataEditor.destroy();
            View.prototype.dispose.call(this, arguments);
        }
    });

    return DataView;
});
