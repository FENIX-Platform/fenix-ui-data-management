define([
    'fx-d-m/views/base/view',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'text!fx-d-m/templates/landing',
    'fx-d-m/components/resource-manager',
    'i18n!fx-d-m/nls/labels',
], function (View, C, DC, template, ResourceManager, MLRes) {
    'use strict';

    var s = {
        BTN_ADD: '#btnAdd',
        BTN_SEARCH: '#btnSearch',
        TXT_INTRO: '#DManIntro',
        TXT_HEADER: '#DManHeader'
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

            this.$el.find(s.TXT_INTRO).html(MLRes.DManIntro);
            this.$el.find(s.TXT_HEADER).html(MLRes.DManHeader);
            //this.initVariables();
            //this.accessControlCheck();
            this.bindEventListener();
        },

        bindEventListener: function () {
            var btnAdd = this.$el.find(s.BTN_ADD);
            var btnSearch = this.$el.find(s.BTN_SEARCH);

            btnAdd.find("#btnAddText").html(MLRes.btnAdd);
            btnSearch.find("#btnSearchText").html(MLRes.btnSearch);


            btnAdd.on('click', function (e) {
                window.location.hash = 'add';
                ResourceManager.closeCurrentResource();
            })

            btnSearch.on('click', function (e) {
                window.location.hash = 'search';
            })
        },

       /* onSectionClick: function (evt) {
            var section = $(evt.currentTarget).data('section');
            Chaplin.utils.redirectTo(section + '#show');
        },*/

    });

    return LandingView;
});
