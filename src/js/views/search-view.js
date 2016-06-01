/*global define, amplify*/
define([
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

            this.catalog = new Catalog({
                $el: document.querySelector('#catalog-container'),
                defaultSelectors: ['resourceType', 'contextSystem'],
                environment: C.ENVIRONMENT,
                selectorsRegistry : {
                    contextSystem : {
                        selector : {
                            id : "dropdown",
                            source : [
                                {value : C.DSD_EDITOR_CONTEXT_SYSTEM, label : C.DSD_EDITOR_LABEL}
                            ],
                            default : [C.DSD_EDITOR_CONTEXT_SYSTEM],
                            hideSummary : true
                        },

                        template : {
                            hideRemoveButton : false
                        },

                        format : {
                            output : "enumeration",
                            metadataAttribute: "dsd.contextSystem"
                        }
                    }

                }

            });
            this.bindEventListeners();
        },

        bindEventListeners: function () {
            amplify.subscribe(this.catalog._getEventName("select"), this, this.selectResource);
            //amplify.subscribe('fx.widget.catalog.select', this, this.selectResource);
        },

        selectResource: function (resource) {
            //console.log(resource)
            var succ = null;
            var err = function () {
                new PNotify({ title: '', text: MLRes.errorLoadinResource, type: 'error' });
            }

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
