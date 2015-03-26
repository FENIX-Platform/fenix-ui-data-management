define([
    'chaplin',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/dsd.hbs',
    'fx-DSDEditor/start',
    'fx-DataUpload/start',
    'fx-d-m/components/resource-manager',
    'pnotify'
], function (Chaplin, View, template, DSDEditor, DataUpload, ResourceManager, PNotify) {
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
            var me = this;

            //DSD Editor
            var servicesUrls = {
                metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
                dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
                dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources"
            },
            //DSDEditor container
            DSDEditorContainerID = '#DSDEditorMainContainer';

            DSDEditor.init(DSDEditorContainerID,
                {
                    subjects: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Subjects.json",
                    datatypes: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Datatypes.json",
                    //codelists: "submodules/fenix-ui-DSDEditor/config/DSDEditor/Codelists_UNECA.json",
                    codelists: "config/submodules/DSDEditor/CodelistsUAE.json",
                    servicesUrls: servicesUrls
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

            if (this.resource && this.resource.metadata.dsd && this.resource.metadata.dsd.columns)
                DSDEditor.setColumns(this.resource.metadata.dsd.columns);
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
            var data, columnsUpload, columnsDSD;
            var me = this;

            $('#divUplaodCSV').on('dataParsed.DataUpload.fenix', function () {
                columnsUpload = DataUpload.getColumns();
                if (columnsUpload) {
                    data = DataUpload.getData();
                    DSDEditor.setColumns(columnsUpload);
                }
                else {
                    DSDEditor.reset();
                    DataUpload.alertValidation();
                }
            })


            //var $uidVerModal = $('#uidVerPopup');


            //$('#btnColsLoad').on('click', function () { console.log('modal'); $uidVerModal.modal('show'); console.log($uidVerModal); });
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
                        text: '__UID cannot be blank',
                        type: 'error'
                    });
                    return;
                }
                ResourceManager.loadDSDColumns({ metadata: { uid: uid, version: $txtVersion.val() } }, function (cols) {
                    if (cols == null) {
                        new PNotify({
                            title: '',
                            text: '__DSD not found',
                            type: 'error'
                        });
                    }
                    else {
                        DSDEditor.setColumns(cols);
                        new PNotify({
                            title: '',
                            text: '__DSD loaded',
                        });
                        $uidVerModal.modal('hide');
                    }
                });
            });

            $('#btnColsEditDone').on('click', function () {
                columnsDSD = DSDEditor.getColumns();
                if (columnsDSD) {
                    if (data)
                        me.resource.data = data;
                    if (!me.resource.metadata.dsd)
                        me.resource.metadata.dsd = {};
                    me.resource.metadata.dsd.columns = columnsDSD;
                    ResourceManager.updateDSD(
                        me.resource, function () { ResourceManager.loadResource(me.resource, function () { Chaplin.utils.redirectTo('data#show'); }); }
                        );
                }
            })
        },

        unbindEventListeners: function () {
            $('#divUplaodCSV').off('click');
            $('#btnColsEditDone').off('click')

            $('#btnColsLoad').off('click');
            $('#btnUidVerCanc').off('click');
            $('#btnUidVerOk').off('click');
        },

        dispose: function () {


            DataUpload.destroy();
            DSDEditor.destroy();

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return DsdView;
});
