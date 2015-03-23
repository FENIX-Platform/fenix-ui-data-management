define([
    'chaplin',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/dsd.hbs',
    'fx-DSDEditor/start',
    'fx-DataUpload/start',
    'fx-d-m/components/resource-manager'
], function (Chaplin, View, template, DSDEditor, DataUpload, ResourceManager) {
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
                    if (me.resource && me.resource.metadata.dsd && me.resource.metadata.dsd.columns)
                        DSDEditor.setColumns(me.resource.metadata.dsd.columns);
                });

            //Data Upload

            DataUpload.init('#divUplaodCSV');

            this.bindEventListeners();

            if (this.resource && this.resource.metadata.dsd && this.resource.metadata.dsd.columns)
                DSDEditor.setColumns(this.resource.metadata.dsd.columns);

            /*TEST*/

            /*DSDEditor.setColumns(
                [
                    { "id": "CODE", "title": { "EN": "hh" }, "key": true, "dataType": "code", "domain": { "codes": [{ "idCodeList": "ECO_GAUL", "codes": [{ "code": "281" }] }] }, "subject": "item", "supplemental": null },
                    { "id": "YEAR", "title": { "EN": "time" }, "key": true, "dataType": "date", "domain": null, "subject": "time", "supplemental": null },
                    { "id": "NUMBER", "title": { "EN": "val" }, "key": false, "dataType": "number", "subject": "value", "supplemental": null }
                ]);*/



            /*END TEST*/
        },

        bindEventListeners: function () {
            var data, columnsUpload, columnsDSD;
            var me = this;

            //$('#btnUploadDone').on('click', function () {
            $('#divUplaodCSV').on('dataParsed.DataUpload.fenix', function () {
                columnsUpload = DataUpload.getColumns();
                if (columnsUpload) {
                    data = DataUpload.getData();
                    /*TEST*/
                    /*
                    columnsUpload[0].key = true;
                    columnsUpload[0].subject = 'time';
                    columnsUpload[0].dataType = 'year';
    
                    columnsUpload[1].key = true;
                    columnsUpload[1].subject = 'item';
                    columnsUpload[1].dataType = 'code';
                    columnsUpload[1].domain = { "codes": [{ "idCodeList": "ECO_GAUL" }] };
    
    
                    columnsUpload[2].key = false;
                    columnsUpload[2].subject = 'value';
                    columnsUpload[2].dataType = 'number';
                    */
                    /*END TEST*/
                    DSDEditor.setColumns(columnsUpload);
                }
                else {
                    DSDEditor.reset();
                    DataUpload.alertValidation();
                }
            })

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
