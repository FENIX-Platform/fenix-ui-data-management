define([
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/metadata.hbs',
    'fx-editor/start',
    'fx-d-m/components/resource-manager',
    'chaplin',
    'amplify'
], function (C, DC, View, template, Editor, ResourceManager, Chaplin) {

    'use strict';
    var s = {
        METADATA_CONTAINER: 'div#metadataEditorContainer'
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

            var sourceValues = null,
                SERVICE_PREFIX = C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS;

            if (this.resource) {
                if (this.resource.metadata.uid != null && this.resource.metadata.version == null) {
                    sourceValues = {
                        "url": SERVICE_PREFIX + "/resources/metadata/uid/" + this.resource.metadata.uid + "?full=true",
                        "type": "get"
                    };
                }

                if (this.resource.metadata.version != null && this.resource.metadata.uid != null) {
                    sourceValues = {
                        "url": SERVICE_PREFIX + "/resources/metadata/" + this.resource.metadata.uid + "/" + this.resource.metadata.version + "?full=true",
                        "type": "get"
                    };
                }
            }

            var userConfig = {
                //container: "div#metadataEditorContainer",
                container: s.METADATA_CONTAINER,
                source: sourceValues,
                resourceType: 'dataset', //dataset, geographic, codelist
                readOnly: false,
                leftSideMenu:true,
                widget: {
                    lang: 'EN'
                },
                config: {
                    gui: C.METADATA_EDITOR_GUI || DC.METADATA_EDITOR_GUI,
                    validation: C.METADATA_EDITOR_VALIDATION || DC.METADATA_EDITOR_VALIDATION,
                    jsonMapping: C.METADATA_EDITOR_JSON_MAPPING || DC.METADATA_EDITOR_JSON_MAPPING,
                    ajaxEventCalls: C.METADATA_EDITOR_AJAX_EVENT_CALL || DC.METADATA_EDITOR_AJAX_EVENT_CALL,
                    dates: C.METADATA_EDITOR_DATES || DC.METADATA_EDITOR_DATES
                },
                onFinishClick: function (data) {
                    //console.log(data)
                    // then call your function passing the "data" variable;
                }
            };

            this.editor = new Editor();
            this.editor.init(userConfig);
            this.bindEventListeners();
        },

        editorFinish: function (e) {
            if (!e.data) {
                new PNotify({
                    title: '',
                    text: 'Nothing to save',
                    type: 'error'
                });
                return;
            }
            //Wrap in the standard resource's structure
            var existingDSD = null;
            if (this.resource && this.resource.metadata && this.resource.metadata.dsd)
                existingDSD = this.resource.metadata.dsd;
            if (!this.resource)
                this.resource = {};
            this.resource.metadata = e.data;
            if (existingDSD)
                this.resource.metadata.dsd = existingDSD;

            ResourceManager.setCurrentResource(this.resource);
            Chaplin.utils.redirectTo({ url: 'resume' });
        },

        bindEventListeners: function () {
            var me = this;

            $('#metaeditor-loadMeta-btn').on('click', function () {
                var uid = $('#resourceUid').val();
                var version = $('#resourceVersion').val();
                amplify.publish("fx.editor.metadata.copy", { version: version, uid: uid });
            });

            $('#metaeditor-close-btn').on('click', function () {
                // Dispatch/Trigger/Fire the event
                amplify.publish("fx.editor.metadata.exit", {});
            });
            amplify.subscribe("fx.editor.finish", this, this.editorFinish);
        },
        unbindEventListeners: function () {
            $('#metaeditor-loadMeta-btn').off();
            $('#metaeditor-close-btn').off('click');
            amplify.unsubscribe("fx.editor.finish", this.editorFinish);
        },

        dispose: function () {
            this.unbindEventListeners();
            this.editor.destroy();
            View.prototype.dispose.call(this, arguments);
        }
    });

    return MetadataView;
});
