define([
    'chaplin',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/resume.hbs',
    'fx-d-m/components/resource-manager'
], function (Chaplin, View, template, ResourceManager) {
    'use strict';

    var s = {
        BTN_META: '#btnMeta',
        BTN_DSD: '#btnDSD',
        BTN_DATA: '#btnData'
    }

    var ResumeView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'resume-view',
        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {
            View.prototype.attach.call(this, arguments);
            this.initVariables();
            this.accessControlCheck();
            this.bindEventListener();
        },

        bindEventListener: function () {
            this.$el.find('[data-section]').on('click', this.onSectionClick);
        },

        onSectionClick: function (evt) {
            var section = $(evt.currentTarget).data('section');
            Chaplin.utils.redirectTo(section + '#show');
        },

        accessControlCheck: function () {
            //this.btnMeta.prop('disabled', 'disabled');
            this.btnDSD.prop('disabled', 'disabled');
            this.btnData.prop('disabled', 'disabled');

            if (!ResourceManager.isResourceAvailable())
                return;
            if (!ResourceManager.hasData())
                this.btnDSD.removeAttr('disabled', '');
            if (ResourceManager.hasColumns())
                this.btnData.removeAttr('disabled', '');
        },

        initVariables: function () {
            this.btnMeta = this.$el.find(s.BTN_META);
            this.btnDSD = this.$el.find(s.BTN_DSD);
            this.btnData = this.$el.find(s.BTN_DATA);
        }

    });

    return ResumeView;
});
