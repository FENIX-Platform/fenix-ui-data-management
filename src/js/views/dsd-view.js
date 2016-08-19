define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/dsd.hbs',
    'fx-DSDEditor/start',
    //'fx-DSDEditor/js/dataManagementCommons/FileUploadHelper',
    //'fx-DSDEditor/js/dataManagementCommons/Notifications',
    'fx-DataMngCommons/js/FileUploadHelper',
    'fx-DataMngCommons/js/Notifications',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement'
], function (Chaplin, C, DC, View, template, DSDEditor, FUploadHelper, Notif, ResourceManager, MLRes) {
    'use strict';
    var h = {
        btnColsEditDone: "#btnColsEditDone",
        btnDSDDownload: "#btnDSDDownload",
        btnUploadGroup: "#btnUploadGroup",
        lblUpload: "#lblUpload",
        lblDownload: "#lblDownload",
        DSDEditorContainer: '#DSDEditorMainContainer',
        DSDHeader: "#DSDHeader"

    };
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

            DSDEditor.init(h.DSDEditorContainer, null, function () {
                if (me.resource && me.resource.metadata.dsd) {
                    DSDEditor.set(me.resource.metadata.dsd);
                    if (me.resource.data && me.resource.data.length > 0)
                        me.isDSDEditable(false);
                    else
                        me.isDSDEditable(true);
                }
            });

            //FUpload
            this.fUpload = new FUploadHelper({ accept: ['json'] });
            this.fUpload.render('#dsdFUpload');

            this.bindEventListeners();

            $(h.btnColsEditDone).removeAttr('disabled');
            this._doML();
        },
        isDSDEditable: function (editable) {
            DSDEditor.editable(editable);
            //var $btn = $(h.btnColsEditDone);
            if (editable) {
                //$btn.show();
                $(h.btnUploadGroup).show();
                //$btn.removeAttr('disabled');
            }
            else {
                //$btn.hide();
                $(h.btnUploadGroup).hide();
            }
        },
        bindEventListeners: function () {
            var me = this;
            var $btnColsEditDone = $(h.btnColsEditDone);
            $btnColsEditDone.on('click', function () {
                var isValid = DSDEditor.validate();
                if (!isValid)
                    return;
                $btnColsEditDone.attr('disabled', 'disabled');

                me.resource.metadata.dsd = DSDEditor.get();
                //Force contextSys and datasource
                var contextSys = C.DSD_EDITOR_CONTEXT_SYSTEM || DC.DSD_EDITOR_CONTEXT_SYSTEM;
                var datasources = C.DSD_EDITOR_DATASOURCES || DC.DSD_EDITOR_DATASOURCES;
                me.resource.metadata.dsd.contextSystem = contextSys;
                me.resource.metadata.dsd.datasources = datasources;

                //ajax callbacks
                var succ = function () {
                    Notif.showSuccess(MLRes.success, MLRes.resourceSaved)
                    Chaplin.utils.redirectTo('resume#show');
                };
                var loadErr = function () {
                    Notif.showError(MLRes.error, MLRes.errorLoadinResource);
                };
                var updateDSDErr = function () {
                    Notif.showError(MLRes.error, MLRes.errorSavingResource);
                };
                var complete = function () {
                    $btnColsEditDone.removeAttr('disabled');
                };
                //ajax call
                ResourceManager.updateDSD(me.resource, function () {
                    ResourceManager.loadResource(me.resource, succ, loadErr, complete);
                }, updateDSDErr, complete);
            });

            $(h.btnDSDDownload).on('click', function () {
                var toSave = JSON.stringify(DSDEditor.get());
                var dLink = document.createElement('a');
                dLink.download = 'DSD.json';
                dLink.innerHTML = "Download file";
                var textFileAsBlob = new Blob([toSave], { type: 'text/plain' });
                dLink.href = window.URL.createObjectURL(textFileAsBlob);
                dLink.onclick = function (evt) { document.body.removeChild(dLink); };
                dLink.style.display = 'none';
                document.body.appendChild(dLink);
                dLink.click();
            });

            amplify.subscribe('textFileUploaded.FileUploadHelper.fenix', this, this._DSDLoaded);

            amplify.subscribe('fx.DSDEditor.toColumnEditor', this._toColumnEditor);
            amplify.subscribe('fx.DSDEditor.toColumnSummary', this._toColumnSummary);
        },
        _toColumnEditor: function () {
            $(h.btnColsEditDone).attr('disabled', 'disabled');
            $(h.btnDSDDownload).hide();
            $(h.btnUploadGroup).hide();
        },
        _toColumnSummary: function () {
            $(h.btnColsEditDone).removeAttr('disabled');
            $(h.btnDSDDownload).show();
            $(h.btnUploadGroup).show();
        },
        _DSDLoaded: function (data) {
            var existingDSD = DSDEditor.get();
            if (existingDSD.columns && existingDSD.columns.length > 0) {
                if (!confirm(MLRes.overwriteExistingDSD)) {
                    this.fUpload.reset();
                    return;
                }
            }
            try {
                var dsd = JSON.parse(data);
            }
            catch (ex) {
                Notif.showError(MLRes.error, MLRes.errorParsingJson);
                this.fUpload.reset();
                return;
            }
            DSDEditor.set(dsd);
            DSDEditor.validate();
            this.fUpload.reset();
        },
        unbindEventListeners: function () {
            $(h.btnColsEditDone).off('click');
            $(h.btnDSDDownload).off('click');
            amplify.unsubscribe('fx.DSDEditor.toColumnEditor', this._toColumnEditor);
            amplify.unsubscribe('fx.DSDEditor.toColumnSummary', this._toColumnSummary);
            amplify.unsubscribe('textFileUploaded.FileUploadHelper.fenix', this._DSDLoaded);
        },
        dispose: function () {
            DSDEditor.destroy();
            this.unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        },
        _doML: function () {
            $(h.btnColsEditDone).html(MLRes.btnSaveDSD)
            $(h.btnDSDDownload).html(MLRes.downloadDSD);
            $(h.lblUpload).html(MLRes.uploadDSD);
            $(h.lblDownload).html(MLRes.downloadDSD);
            $(h.DSDHeader).html(MLRes.DSDHeader);

        }
    });

    return DsdView;
});
