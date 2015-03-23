define([
    'chaplin',
    'underscore',
    'fx-d-m/views/site-view',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/resume-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, _, SiteView, Controller, ResumeView, ResourceManager, Events, RSVP) {

    'use strict';

    var ResumeController = Controller.extend({

        beforeAction: function () {

            Controller.prototype.beforeAction.apply(this, arguments);

            return this.performAccessControlChecks().then(
                undefined, _.bind(this.denyAccessControl, this))
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

        show: function (params, route, options) {
            if (this.authorized === false) {
                // user in not authorized
                Chaplin.mediator.publish(Events.RESOURCE_ABSENT);
                return;
            }
            //User is authorized
            this.view = new ResumeView({
                region: 'main',
                query: options.query
            });

        }

    });

    return ResumeController;

});
