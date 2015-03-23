define([
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/metadata.hbs',
    'fx-editor/start',
    'fx-d-m/components/resource-manager',
    'chaplin',
    'amplify'
], function (View, template, Editor, ResourceManager, Chaplin) {

    'use strict';
    var s = {
        METADATA_CONTAINER: 'div#metadataEditorContainer'
    }

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

            var sourceValues = null;

            if (this.resource) {
                if (this.resource.metadata.uid != null && this.resource.metadata.version == null) {
                    sourceValues = {
                        "url": "http://fenix.fao.org/d3s_dev/msd/resources/metadata/uid/" + this.resource.metadata.uid + "?full=true",
                        "type": "get"
                    };
                }

                if (this.resource.metadata.version != null && this.resource.metadata.uid != null) {
                    sourceValues = {
                        "url": "http://fenix.fao.org/d3s_dev/msd/resources/metadata/" + this.resource.metadata.uid + "/" + this.resource.metadata.version + "?full=true",
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
                widget: {
                    lang: 'EN'
                },
                config: {
                    gui: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config.json",
                    validation: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config.json",
                    jsonMapping: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config.json",
                    ajaxEventCalls: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config_DEV.json",
                    dates: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-dates-config.json"
                },
                onFinishClick: function (data) {
                    console.log(data)
                    // then call your function passing the "data" variable;
                }
            };

            this.editor = new Editor();
            this.editor.init(userConfig);
            this.bindEventListeners();
        },

        editorFinish: function (e) {

            console.log(e)
            console.log("=== LISTENER  ====");
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

            /*
             ResourceManager.updateDSD(
             me.resource, function () { ResourceManager.loadResource(me.resource, function () { Chaplin.utils.redirectTo('data#show'); }); }
             );
             */

            //console.log(e.detail.data);
        },

        bindEventListeners: function () {
            var me = this;
            $('#metaeditor-close-btn').on('click', function () {
                // Dispatch/Trigger/Fire the event
                //var event = new CustomEvent("fx.editor.metadata.exit", {});
                //document.body.dispatchEvent(event);

                amplify.publish("fx.editor.metadata.exit", {});
                /*
                 me.$container.trigger(EVT_CHANGE, null);
                 //todo check if resource is saved
                 Chaplin.utils.redirectTo('resume#show');*/
            });


            //document.body.addEventListener("fx.editor.finish", me.editorFinish, false);
            amplify.subscribe("fx.editor.finish", this, this.editorFinish);


            // $(s.METADATA_CONTAINER).on("fx.editor.finish", function (data) { alert('gk'); console.log(data); })

            /*
             */
            /*
             document.body.addEventListener("fx.editor.finish", function (e) {
             console.log(e.detail.data)
             // then call your function passing the �e.detail.data�

             }, false);
             */

        },
        unbindEventListeners: function () {
            $('#test-close-btn').off('click');
            //document.body.removeEventListener("fx.editor.finish", this.editorFinish, false);
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
