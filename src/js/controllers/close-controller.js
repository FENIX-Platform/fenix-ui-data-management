define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/close-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, Controller, CloseView, ResourceManager, Events, RSVP) {
    'use strict';

    var CloseController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {

                if (!ResourceManager.isResourceAvailable()) {
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

            //Close current resource
            ResourceManager.closeCurrentResource();

            this.view = new CloseView({
                region: 'main'
            });
        }
    });

    return CloseController;

});
