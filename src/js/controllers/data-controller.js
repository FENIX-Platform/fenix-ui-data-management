define([
    'chaplin',
    'underscore',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/data-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, _, Controller, dataView, ResourceManager, Events, RSVP) {

    'use strict';

    var DataController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {
                if (!ResourceManager.isResourceAvailable()) 
                    rejected();
                if (!ResourceManager.isResourceAvailable()) {
                    rejected();
                    return;
                }

                var resource = ResourceManager.getCurrentResource();
                if (!resource.metadata.dsd || !resource.metadata.dsd.columns) {
                    rejected();
                    return;
                }
                fulfilled();
            });
        },

        denyAccessControl: function () {
            this.authorized = false;
        },

        show: function (params) {

            if (this.authorized === false) {
                // user in not authorized
                Chaplin.mediator.publish(Events.RESOURCE_ABSENT);
                return;
            }

            //User is authorized
            this.view = new dataView({
                model: this.model,
                region: 'main'
            });
        }

    });

    return DataController;
});
