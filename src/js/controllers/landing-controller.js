define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/landing-view',
    'fx-d-m/views/site-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, Controller, LandingView, SiteView, ResourceManager, Events, RSVP) {

    'use strict';

    var LandingController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {

            return new RSVP.Promise(function (fulfilled, rejected) {
                if (ResourceManager.isResourceAvailable())
                    rejected();
                fulfilled();
            });
        },

        denyAccessControl: function () {
            this.authorized = false;
        },

        show: function (params, route, options) {
            if (this.authorized === false) {
                // user in not authorized
                Chaplin.mediator.publish(Events.SKIP_LANDING_PAGE);
                return;
            }
            this.view = new LandingView({
                model: this.model,
                region: 'main',
                query: options.query
            });

        }
    });

    return LandingController;

});
