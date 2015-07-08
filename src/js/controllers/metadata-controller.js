define([
    'chaplin',
    'underscore',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/metadata-view',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp'
], function (Chaplin, _, Controller, MetadataView, AccessManager, Events, RSVP) {

    'use strict';

    var MetadataController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this));
        },

        performAccessControlChecks: function () {
            var me = this;
            console.log(  AccessManager.isLogged())

            return new RSVP.Promise(function (fulfilled, rejected) {
                console.log(AccessManager.isLogged())

                if (!AccessManager.isLogged()) {
                    me.authorized = false;
                    rejected();
                    return;
                }
                fulfilled();
            });
        },
        denyAccessControl: function () { },

        show: function (params, route, options) {
            console.log('h1');
            console.log(this.authorized);
            if (this.authorized === false) {
                Chaplin.mediator.publish(Events.NOT_LOGGED);
                return;
            }
            this.view = new MetadataView({
                model: this.model,
                region: 'main',
                query: options.query
            });

        }
    });

    return MetadataController;

});
