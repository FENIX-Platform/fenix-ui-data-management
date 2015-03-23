define([
    'chaplin',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/close.hbs'
], function (Chaplin, View, template) {
    'use strict';

    var CloseView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'close-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template

        });

    return CloseView;
});
