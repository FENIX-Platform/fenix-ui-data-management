define([
    'chaplin',
    'fx-d-m/views/base/view',
    'fx-d-m/components/resource-manager',
    'text!fx-d-m/templates/delete.hbs'
], function (Chaplin, View, ResourceManager, template) {
    'use strict';

    var DeleteView = View.extend({

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

        onDelete : function () {

            //Delete current resource
            ResourceManager.deleteCurrentResource({
                success : function () {
                   console.log("cancellata")
                }
            });

        },

        onUndo: function () {
            Chaplin.utils.redirectTo({url: 'resume'});
        }

        });

    return DeleteView;
});
