define([
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/landing',
    'fx-d-m/components/resource-manager'
], function (View, template, ResourceManager) {
    'use strict';

    var s = {
        BTN_ADD: '#btnAdd'
    }

    var LandingView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'landing-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {
            View.prototype.attach.call(this, arguments);
            //this.initVariables();
            //this.accessControlCheck();
            this.bindEventListener();
        },

        bindEventListener: function () {
            var btnAdd = this.$el.find(s.BTN_ADD);
            
            btnAdd.on('click', function (e) {
                ResourceManager.closeCurrentResource();
            })
        },

       /* onSectionClick: function (evt) {
            var section = $(evt.currentTarget).data('section');
            Chaplin.utils.redirectTo(section + '#show');
        },*/

    });

    return LandingView;
});
