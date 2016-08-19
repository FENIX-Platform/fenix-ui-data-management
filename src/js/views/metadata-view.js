define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/metadata.hbs',
    'fx-MetaEditor2/start',
    'fx-DataMngCommons/js/Notifications',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
], function (Chaplin, C, DC, View, template, MetadataEditor, Notif, ResourceManager, MLRes) {
    'use strict';
    var h = {
        MetaEditorContainer: '#metadataEditorContainer',
        btnShowCopy: '.dropdown-menu input, .dropdown-menu label',
        btnSaveMeta: '#btnSaveMeta',
        btnCopyMeta: '#metaeditor-loadMeta-btn',
        uidCopyMeta: '#resourceUid',
        verCopyMeta: '#resourceVersion',
        MetaHeader: '#MetaHeader',
        MetaCopyHeader: '#MetaCopyHeader',
        MetaLoad: '#metaeditor-loadMeta-btn'
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
                    console.log("me",me);
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

            $(h.btnShowCopy).on('click',function(e){
                e.stopPropagation();
            });

            $(h.btnCopyMeta).on('click', function() {
                    var resToLoad = { metadata: { uid: $(h.uidCopyMeta).val()} };
                    if ($(h.verCopyMeta).val().length > 0 ) resToLoad.version = $(h.verCopyMeta).val();
                    if ($(h.uidCopyMeta).val().length > 0)  ResourceManager.copyMetaData(resToLoad,
                        function (d) {
                            me.newResource = true;
                            me.resource = ResourceManager.getCurrentResource();
                            MetadataEditor.set(d);
                            Notif.showSuccess(MLRes.success, MLRes.resourceLoaded);
                        },
                        function (e){
                             console.log(e);
                             Notif.showError(MLRes.error, MLRes.errorLoadinResource);
                        });

            });


            $(h.btnSaveMeta).on('click', function () {
                var toSave = MetadataEditor.get();
                if (!toSave) {
                    Notif.showError(MLRes.error, MLRes.errorMetaMinimum);
                    return;
                }
                //console.log("toSave",toSave);
                //toSave.uid = "dan401b";
                var succNew = function (retVal) {
                    var resToLoad = { metadata: { uid: retVal.uid } };
                    if (retVal.version)
                        resToLoad.version = retVal.version;
                    console.log()
                    ResourceManager.loadResource(resToLoad,
                        function (d) {
                            me.resource = ResourceManager.getCurrentResource();
                            MetadataEditor.set(d.metadata);
                            Notif.showSuccess(MLRes.success, MLRes.resourceSaved);
                            Chaplin.utils.redirectTo({ url: 'resume' });
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
                            Notif.showSuccess(MLRes.success, MLRes.resourceSaved);

                            Chaplin.utils.redirectTo({ url: 'resume' });
                        },function(){},function(){console.log("errore")});
                }

                var err = function () {
                    Notif.showError("ERROR", 'Error saving resource, please try again.')
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
            });
        },
        unbindEventListeners: function () {
            $(h.btnSaveMeta).off('click');
            $(h.btnCopyMeta).off('click');
            $(h.btnShowCopy).off('click');
        },
        dispose: function () {
            MetadataEditor.destroy();
            this.unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        },
        _doML: function () {
            $(h.MetaHeader).html(MLRes.MetaHeader);
            $(h.MetaCopyHeader).html(MLRes.MetaCopyHeader);
            $(h.MetaLoad).html(MLRes.btnLoadMeta);
            $(h.uidCopyMeta).attr("placeholder", MLRes.CopyMetaRID);
            $(h.verCopyMeta).attr("placeholder", MLRes.CopyMetaVer);
        }
    });

    return MetadataView;
});
