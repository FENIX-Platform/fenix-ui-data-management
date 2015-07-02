define([
    'chaplin',
    'underscore',
    'fx-d-m/views/site-view',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/resume-view',
    'fx-d-m/components/resource-manager',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, _, SiteView, Controller, ResumeView, ResourceManager, AccessManager, Events, RSVP) {

    'use strict';

    var ResumeController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.apply(this, arguments);

            return this.performAccessControlChecks().then(
                undefined, _.bind(this.denyAccessControl, this));
        },

        performAccessControlChecks: function () {
            var me = this;
            return new RSVP.Promise(function (fulfilled, rejected) {
            /*    me.resourceLoaded = false;
                rejected();
                return;*/
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
        },

        show: function (params, route, options) {
            if (this.authorized === false) {
                Chaplin.mediator.publish(Events.NOT_LOGGED);
                return;
            }
            if (this.resourceLoaded === false) {
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