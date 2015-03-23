define([
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/landing.hbs'
], function (View, template) {
    'use strict';

    var LandingView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'landing-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template
    });

    return LandingView;
});
