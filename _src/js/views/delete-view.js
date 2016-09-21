define([
    'chaplin',
    'fx-d-m/views/base/view',
    'fx-d-m/components/resource-manager',
    'text!fx-d-m/templates/delete.hbs',
    'i18n!fx-d-m/nls/labels',
    'pnotify'
], function (Chaplin, View, ResourceManager, template, MLRes) {
    'use strict';

    var h = {
            "btnDeleteUndo" : "#btnDeleteUndo",
            "btnDeleteConfirm" : "#btnDeleteConfirm",
            "DeleteHeader" : "#DeleteHeader"
    },

    DeleteView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'close-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        events: {
            'click #delete-confirm': 'onDelete',
            'click #delete-undo': 'onUndo'
        },

        attach: function() {
            View.prototype.attach.call(this, arguments);
            this._doML();
        },

        onDelete: function () {

            //Delete current resource
            var err = function () {
                var notice = new PNotify({
                    title: 'Resource Deleted',
                    text: 'Current resource correctly deleted.',
                    type: 'success',
                    buttons: {
                        closer: false,
                        sticker: false
                    }

                });
                notice.get().click(function() {
                    notice.remove();
                });
            };
            var succ = function () {
                new PNotify({ title: MLRes.resourceDeleted, text: MLRes.resourceDeleted, type: 'success' });
                Chaplin.utils.redirectTo({ url: 'search' });
            };
            ResourceManager.deleteCurrentResource(succ, err);
        },

        onUndo: function () {
            Chaplin.utils.redirectTo({url: 'resume'});
        },

        _doML: function (){
            $(h.btnDeleteUndo).html(MLRes.btnDeleteUndo);
            $(h.btnDeleteConfirm).html(MLRes.btnDeleteConfirm);
            $(h.DeleteHeader).html(MLRes.DeleteHeader);
        }

    });

    return DeleteView;
});
