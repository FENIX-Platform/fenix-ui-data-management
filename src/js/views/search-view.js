/*global define, amplify*/
define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/search.hbs',
    'fx-cat-br/start',
    'fx-d-m/config/events',
    'i18n!fx-d-m/i18n/nls/ML_DataManagement',
    'amplify',
    'pnotify'
], function (Chaplin, C, DC, View, template, Catalog, Events, MLRes) {

    'use strict';

    var SearchView = View.extend({

        initialize: function (o) {
            $.extend(true, this, o);
            View.prototype.initialize.call(this, arguments);
        },

        // Automatically render after initialize
        autoRender: true,

        className: 'search-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this.catalog = new Catalog({
                catalog: {
                    BLANK_FILTER: DC.CATALOG_BLANK_FILTER || C.CATALOG_BLANK_FILTER
                },
                results: {
                    actions: {
                        SELECT_RESOURCE: {
                            event: 'select',
                            labels: {
                                EN: 'Select Resource'
                            }
                        }
                    }
                }
            });

            this.catalog.init({
                container: document.querySelector('#catalog-container')
            });

        },

        bindEventListeners: function () {

            amplify.subscribe('fx.widget.catalog.select', this, this.selectResource);
        },

        selectResource: function (resource) {
            var succ = null;
            var err = function () {
                new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' });
            }

            Chaplin.mediator.publish(Events.RESOURCE_SELECT, { metadata: resource }, succ, err, null, 1);
        },

        dispose: function () {

            amplify.unsubscribe('fx.widget.catalog.select', this.selectResource);

            this.catalog.destroy();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return SearchView;
});
