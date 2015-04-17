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

            var columns, data;
            this.resource = ResourceManager.getCurrentResource();
            if (!this.resource || !this.resource.metadata || !this.resource.metadata.dsd || !this.resource.metadata.dsd.columns)
                return;
            columns = this.resource.metadata.dsd.columns;
            data = this.resource.data;

            this.bindEventListeners();
            //Data Editor container
            var dataEditorContainerID = "#DataEditorMainContainer";
            var $dataEditorContainer = $("#DataEditorMainContainer");
            var $dataEditorContainerLoader = $("#DataEditorLoaderContainer");

            DataEditor.init(dataEditorContainerID,
                {},
                function () {
                   // $dataEditorContainer.hide();
                    $dataEditorContainerLoader.show();
                    DataEditor.setColumns(columns,
                        function () {
                            DataEditor.setData(data);
                            //$dataEditorContainer.show();
                            $dataEditorContainerLoader.hide();
                        })
                });
        },

        bindEventListeners: function () {
            var me = this;
            $('#dataEditEnd').on("click", function () {

                var data = DataEditor.getData();
                //returns false if not valid
                if (data) {
                    var colDist = DataEditor.getColumnsWithDistincts();

                    me.resource.metadata.dsd.columns = colDist;
                    me.resource.data = data;

                    ResourceManager.putData(me.resource,
                        ResourceManager.updateDSD(me.resource, function () {
                            ResourceManager.loadResource(me.resource,
                                function () {
                                    Chaplin.utils.redirectTo('data#show');
                                })
                        })
                    );
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
