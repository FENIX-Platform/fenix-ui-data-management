define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/landing-view',
    'fx-d-m/views/site-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, Controller, LandingView, SiteView, ResourceManager,AccessManager, Events, RSVP) {

    'use strict';

    var LandingController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined,
                _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {
            var me = this;
            return new RSVP.Promise(function (fulfilled, rejected) {
                if (!AccessManager.isLogged()) {
                    me.authorized = false;
                    rejected();
                    return;
                }
                fulfilled();
            });
        },

        denyAccessControl: function () {
            //this.authorized = false;
        },

        show: function (params, route, options) {
            if (this.authorized === false) {
                Chaplin.mediator.publish(Events.NOT_LOGGED);
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
