define([
    'chaplin',
    'underscore',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/data-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, _, Controller, dataView, ResourceManager, AccessManager, Events, RSVP) {

    'use strict';

    var DataController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {
            var me = this;
            return new RSVP.Promise(function (fulfilled, rejected) {
                if (!AccessManager.isLogged()) {
                    me.authorized = false;
                    rejected();
                }
                if (!ResourceManager.isResourceAvailable()) {
                    me.resourceLoaded = false;
                    rejected();
                }

                var resource = ResourceManager.getCurrentResource();
                if (!resource.metadata.dsd || !resource.metadata.dsd.columns) {
                    me.resourceLoadedWithDSD = false;
                    rejected();
                    return;
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
            if (this.resourceLoadedWithDSD === false) {
                Chaplin.mediator.publish(Events.DSD_ABSENT);
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
