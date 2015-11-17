define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/metadata.hbs',
    'fx-MetaEditor2/start',
    'fx-MetaEditor2/js/dataManagementCommons/Notifications',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
], function (Chaplin, C, DC, View, template, MetadataEditor, Noti, ResourceManager, MLRes) {
    'use strict';
    var h = {
        MetaEditorContainer: '#metadataEditorContainer',
        btnSaveMeta: '#btnSaveMeta'
    };
    var MetadataView = View.extend({
        // Automatically render after initialize
        autoRender: true,

        className: 'metadata-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.resource = ResourceManager.getCurrentResource();
            this.newResource = true;
            var me = this;
            var cfg = null;
            var MetaInitCallB = function () {
                if (me.resource && me.resource.metadata) {
                    MetadataEditor.set(me.resource.metadata);
                    me.newResource = false;
                }
                else {
                    //MetadataEditor.reset();
                    me.newResource = true;
                }
            };
            MetadataEditor.init(h.MetaEditorContainer, cfg, MetaInitCallB);

            this.bindEventListeners();

            this._doML();
        },

        bindEventListeners: function () {
            var me = this;

            /*$('#btnLoadMeta').on('click', function () {
                ResourceManager.loadResource({ metadata: { uid: "dan401" } },
                function (d) {
                    //console.log("LOAD"); console.log(d);
                    MetadataEditor.set(d.metadata);
                    me.newResource = false;
                }, function () {
                    console.log("err");
                });
            });*/


            $(h.btnSaveMeta).on('click', function () {
                var toSave = MetadataEditor.get();
                if (!toSave) {
                    Noti.showError("ERROR", 'Please fill the minimum set of metadata in the "Identification" and "Contacts" sections');
                    return;
                }
                //toSave.uid = "dan401b";
                var succNew = function (retVal) {
                    var resToLoad = { metadata: { uid: retVal.uid } };
                    if (retVal.version)
                        resToLoad.version = retVal.version;
                    ResourceManager.loadResource(resToLoad,
                        function (d) {
                            me.resource = ResourceManager.getCurrentResource();
                            MetadataEditor.set(d.metadata);
                        });
                };
                var succUpd = function () {
                    var resToLoad = { metadata: { uid: me.resource.metadata.uid } };
                    if (me.resource.metadata.version)
                        resToLoad.version = me.resource.metadata.version;

                    ResourceManager.loadResource(resToLoad,
                        function (d) {
                            me.resource = ResourceManager.getCurrentResource();
                            MetadataEditor.set(d.metadata);
                        });
                }

                var err = function () {
                    Noti.showError("ERROR", 'Error saving resource, please try again.')
                };
                var complete = function () { };

                var datasources = C.DSD_EDITOR_DATASOURCES || DC.DSD_EDITOR_DATASOURCES;
                var contextSys = C.DSD_EDITOR_CONTEXT_SYSTEM || DC.DSD_EDITOR_CONTEXT_SYSTEM;
                //Add the context system if a new resource is created
                if (me.newResource) {
                    toSave.dsd = { contextSystem: contextSys };
                    ResourceManager.saveMeta(toSave, succNew, err, complete);
                }
                else {

                    if (me.resource && me.resource.metadata && me.resource.metadata.dsd) {
                        toSave.dsd = { rid: me.resource.metadata.dsd.rid };
                    }
                    ResourceManager.updateMeta(toSave, succUpd, err, complete);
                }

                /* console.log("cfg.DSD_EDITOR_CONTEXT_SYSTEM");
                 console.log(cfg.DSD_EDITOR_CONTEXT_SYSTEM);
                 console.log("cfg.DSD_EDITOR_DATASOURCES");
                 console.log(cfg.DSD_EDITOR_DATASOURCES);*/


                /*cfg.DSD_EDITOR_CONTEXT_SYSTEM = "cstat_zmb";
                cfg.DSD_EDITOR_DATASOURCES = ["D3S"];*/
                //toSave.dsd = { datasources: ["D3S"], contextSystem: "demo1" };

                /*
                toSave.dsd = { contextSystem: "demo1" };
                toSave.dsd.rid = "63_195";

                console.log(JSON.stringify(toSave));*/

                //ResourceManager.saveMeta(toSave, succ, err, complete);
                //ResourceManager.updateMeta(toSave, succ, err, complete);


            });
        },
        unbindEventListeners: function () {
            $(h.btnSaveMeta).off('click');
        },
        dispose: function () {
            MetadataEditor.destroy();
            this.unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        },
        _doML: function () {
            /*$(h.btnDSDDownload).html(MLRes.downloadDSD);
            $(h.lblUpload).html(MLRes.upload);*/
        }
    });

    return MetadataView;
});
