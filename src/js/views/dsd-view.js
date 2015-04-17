define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/dsd.hbs',
    'fx-DSDEditor/start',
    'fx-DataUpload/start',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'pnotify'
], function (Chaplin, C, DC, View, template, DSDEditor, DataUpload, ResourceManager, MLRes, PNotify) {
    'use strict';

    var DsdView = View.extend({
        // Automatically render after initialize
        autoRender: true,

        className: 'dsd-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.resource = ResourceManager.getCurrentResource();
            this.uploadedData;
            var me = this;

            //DSDEditor container
            var DSDEditorContainerID = '#DSDEditorMainContainer';

            DSDEditor.init(DSDEditorContainerID,
                {
                    subjects: C.DSD_EDITOR_SUBJECTS || DC.DSD_EDITOR_SUBJECTS,
                    datatypes: C.DSD_EDITOR_DATATYPES || DC.DSD_EDITOR_DATATYPES,
                    codelists: C.DSD_EDITOR_CODELISTS || DC.DSD_EDITOR_CODELISTS
                }, function () {
                    if (me.resource && me.resource.metadata.dsd && me.resource.metadata.dsd.columns) {
                        DSDEditor.setColumns(me.resource.metadata.dsd.columns);
                        if (me.resource.data && me.resource.data.length > 0)
                            me.isDSDEditable(false);
                        else
                            me.isDSDEditable(true);
                    }
                });

            //Data Upload

            DataUpload.init('#divUplaodCSV');

            this.bindEventListeners();

            /*if (this.resource && this.resource.metadata.dsd && this.resource.metadata.dsd.columns)
                DSDEditor.setColumns(this.resource.metadata.dsd.columns);*/

            this._doML();
        },

        isDSDEditable: function (editable) {
            DSDEditor.isEditable(editable);
            if (editable) {
                $('#divColsLoad').show();
                $('#divCSV').show();
                $('#btnColsEditDone').show();
            }
            else {
                $('#divColsLoad').hide();
                $('#divCSV').hide();
                $('#btnColsEditDone').hide();
            }
        },

        bindEventListeners: function () {
            var columnsUpload, columnsDSD;
            var me = this;

            $('#divUplaodCSV').on('dataParsed.DataUpload.fenix', function () {
                columnsUpload = DataUpload.getColumns();
                if (columnsUpload) {
                    me.uploadedData = DataUpload.getData();
                    DSDEditor.setColumns(columnsUpload);
                }
                else {
                    DSDEditor.reset();
                    DataUpload.alertValidation();
                }
            });

            var $uidVerModal = $('#uidVerPopup');
            var $txtUID = $uidVerModal.find('#txtUID');
            var $txtVersion = $uidVerModal.find('#txtVersion');
            $('#btnColsLoad').on('click', function () { $uidVerModal.modal('show'); });
            $('#btnUidVerCanc').on('click', function () { $txtUID.val(''); $txtVersion.val(''); $uidVerModal.modal('hide'); });
            $('#btnUidVerOk').on('click', function () {
                var uid = $txtUID.val();
                if (uid.trim() == '') {
                    new PNotify({
                        title: '',
                        text: MLRes.UIDCannotBeBlank,
                        type: 'error'
                    });
                    return;
                }
                ResourceManager.loadDSDColumns({ metadata: { uid: uid, version: $txtVersion.val() } }, function (cols) {
                    if (cols == null) {
                        new PNotify({
                            title: '',
                            text: MLRes.DSDNotFound,
                            type: 'error'
                        });
                    }
                    else {
                        DSDEditor.setColumns(cols);
                        new PNotify({
                            title: '',
                            text: MLRes.DSDLoaded,
                            type: 'success'
                        });
                        $uidVerModal.modal('hide');
                    }
                });
            });

            $('#btnColsEditDone').on('click', function () {
                if (DSDEditor.hasChanged()) {
                    if (!confirm(MLRes.unsavedWarning))
                        return;
                }

                columnsDSD = DSDEditor.getColumns();
                if (columnsDSD) {
                    if (!me.resource.metadata.dsd) {
                        me.resource.metadata.dsd = {};
                    }

                    me.resource.metadata.dsd.columns = columnsDSD;

                    me.resource.metadata.dsd.datasources = C.DSD_EDITOR_DATASOURCES || DC.DSD_EDITOR_DATASOURCES;
                    me.resource.metadata.dsd.contextSystem = C.DSD_EDITOR_CONTEXT_SYSTEM || DC.DSD_EDITOR_CONTEXT_SYSTEM;

                    ResourceManager.updateDSD(me.resource, function () {
                        ResourceManager.loadResource(me.resource, function () {
                            if (me.uploadedData) {
                                me.resource.data = me.uploadedData;
                                ResourceManager.setCurrentResource(me.resource);
                            }
                            Chaplin.utils.redirectTo('resume#show');
                        });
                    });
                }
            })
        },

        unbindEventListeners: function () {
            $('#divUplaodCSV').off('click');
            $('#btnColsEditDone').off('click');
            $('#btnColsLoad').off('click');
            $('#btnUidVerCanc').off('click');
            $('#btnUidVerOk').off('click');
        },

        dispose: function () {

            DataUpload.destroy();
            DSDEditor.destroy();

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        },

        _doML: function () {
            $('#btnColsLoad').html(MLRes.CopyDSD);
        }
    });

    return DsdView;
});
