define([
    'chaplin',
    'fx-d-m/views/base/view',
    'i18n!fx-d-m/nls/labels',
    'text!fx-d-m/templates/close.hbs'
], function (Chaplin, View, MLRes, template) {
    'use strict';

    var h = {
        CloseHeader : "#CloseHeader",
        btnHome : "#btnHome"
    },

    CloseView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'close-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function() {
            View.prototype.attach.call(this, arguments);

            this._doML();
        },

        _doML: function() {
            $(h.CloseHeader).html(MLRes.CloseHeader);
            $(h.btnHome).html(MLRes.btnHome);
        }


    });

    return CloseView;


});
