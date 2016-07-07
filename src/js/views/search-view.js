/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/search.hbs',
    'fx-catalog/start',
    'fx-d-m/config/events',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'amplify',
    'pnotify'
], function ($, Chaplin, C, DC, View, template, Catalog, Events, MLRes) {

    'use strict';

    var s = {
        CATALOG_EL : '#catalog-container'
    };

    var SearchView = View.extend({

        initialize: function (o) {
            $.extend(true, this, o);
            View.prototype.initialize.call(this, arguments);
        },

        autoRender: true,

        className: 'search-view',

        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.catalog = new Catalog($.extend(true, {}, C.catalog, DC.catalog, {
                el: this.$el.find(s.CATALOG_EL),
                environment: C.environment,
            }));

            this.bindEventListeners();
        },

        bindEventListeners: function () {
            amplify.subscribe(this.catalog._getEventName("select"), this, this.selectResource);
        },

        selectResource: function (resource) {
            //console.log(resource)
            var succ = null;
            var err = function () {
                new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' });
            };

            Chaplin.mediator.publish(Events.RESOURCE_SELECT, { metadata: resource.model }, succ, err, null, 1);
        },

        dispose: function () {

            amplify.unsubscribe(this.catalog._getEventName("select"), this.selectResource);

            this.catalog.dispose();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return SearchView;
});
