/*TODO*/
//Multilanguage
/*TODO*/

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
    var h = {
        btnColsEditDone: "#btnColsEditDone"
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

            var DSDEditorContainerID = '#DSDEditorMainContainer';

            DSDEditor.init(DSDEditorContainerID, null, function () {
                if (me.resource && me.resource.metadata.dsd) {
                    DSDEditor.set(me.resource.metadata.dsd);
                    if (me.resource.data && me.resource.data.length > 0)
                        me.isDSDEditable(false);
                    else
                        me.isDSDEditable(true);
                }
            });




/*
            var test = {
                "columns": [
                    {
                        "dataType": "code",
                        "key": true,
                        "id": "CODE",
                        "title": {
                            "EN": "Item"
                        },
                        "domain": {
                            "codes": [
                                {
                                    "idCodeList": "FAOSTAT_CommodityList"
                                }
                            ]
                        },
                        "subject": "item"
                    },
                    {
                        "dataType": "number",
                        "key": false,
                        "id": "NUMBER",
                        "title": {
                            "EN": "Val"
                        },
                        "subject": "value"
                    }
                ]
            };
            DSDEditor.set(test);*/

            this.bindEventListeners();

            $('#btnColsEditDone').removeAttr('disabled');
            this._doML();
        },

        isDSDEditable: function (editable) {
            DSDEditor.editable(editable);
            if (editable) {
                $('#btnColsEditDone').show();
                $('#btnColsEditDone').removeAttr('disabled');
            }
            else {
                $('#btnColsEditDone').hide();
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
                //ajax callbacks
                var succ = function () {
                    Chaplin.utils.redirectTo('resume#show');
                };
                var loadErr = function () {
                    new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' });
                };
                var updateDSDErr = function () {
                    new PNotify({ title: '', text: MLRes.errorSavingResource, type: 'error' });
                };
                var complete = function () {
                    $btnColsEditDone.removeAttr('disabled');
                };
                ResourceManager.updateDSD(me.resource, function () {
                    ResourceManager.loadResource(me.resource, succ, loadErr, complete);
                }, updateDSDErr, complete);
            });

            amplify.subscribe('fx.DSDEditor.toColumnEditor', this._toColumnEditor);
            amplify.subscribe('fx.DSDEditor.toColumnSummary', this._toColumnSummary);
        },

        _toColumnEditor: function () {
            $(h.btnColsEditDone).attr('disabled', 'disabled');
        },
        _toColumnSummary: function () {
            $(h.btnColsEditDone).removeAttr('disabled');
        },

        unbindEventListeners: function () {
            $(h.btnColsEditDone).off('click');
            amplify.unsubscribe('fx.DSDEditor.toColumnEditor', this._toColumnEditor);
            amplify.unsubscribe('fx.DSDEditor.toColumnSummary', this._toColumnSummary);
        },

        dispose: function () {
            DSDEditor.destroy();

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        },

        _doML: function () {
            //$('#btnColsLoad').html(MLRes.CopyDSD);
        }
    });

    return DsdView;
});
