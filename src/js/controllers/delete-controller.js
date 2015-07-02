define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/delete-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, Controller, DeleteView, ResourceManager, AccessManager, Events, RSVP) {
    'use strict';

    var DeleteController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {

                if (!AccessManager.isLogged()) {
                    me.authorized = false;
                    rejected();
                }
                if (!ResourceManager.isResourceAvailable()) {
                    me.resourceLoaded = false;
                    rejected();
                }

                fulfilled();
            });
        },

        denyAccessControl: function () {
            //this.authorized = false;
        },

        show: function (params) {

            if (this.authorized === false) {
                Chaplin.mediator.publish(Events.NOT_LOGGED);
                return;
            }
            if (this.resourceLoaded === false) {
                Chaplin.mediator.publish(Events.RESOURCE_ABSENT);
                return;
            }

            this.view = new DeleteView({
                region: 'main'
            });
        }
    });

    return DeleteController;

});
