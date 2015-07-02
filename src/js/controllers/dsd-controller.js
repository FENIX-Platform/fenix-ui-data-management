define([
    'chaplin',
    'underscore',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/dsd-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, _, Controller, DsdView, ResourceManager, AccessManager, Events, RSVP) {

    'use strict';

    var DsdController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this));
        },

        /* Access control */

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {

                //var resource;
                /*if (!AccessManager.isAuth())
                    rejected();*/

                if (!AccessManager.isLogged()) {
                    me.authorized = false;
                    rejected();
                }
                if (!ResourceManager.isResourceAvailable()) {
                    me.resourceLoaded = false;
                    rejected();
                }
                
                //Fulfilled, the DSD interface will disable the edit features
                if (ResourceManager.hasData())
                    //rejected();
                    fulfilled();

                fulfilled();
            });
        },

        denyAccessControl: function () {
            //this.authorized = false;
        },
        /* End Access control */

        show: function () {
            if (this.authorized === false) {
                Chaplin.mediator.publish(Events.NOT_LOGGED);
                return;
            }
            if (this.resourceLoaded === false) {
                Chaplin.mediator.publish(Events.RESOURCE_ABSENT);
                return;
            }

            // user in authorized
            this.view = new DsdView({
                model: this.model,
                region: 'main'
            });

        }

    });

    return DsdController;
});
