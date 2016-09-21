/*global amplify, define*/
define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/search-view',
    'fx-d-m/components/access-manager',
    'fx-d-m/config/events',
    'rsvp',
    'amplify'
], function (Chaplin, Controller, SearchView, AccessManager, Events, RSVP) {

    'use strict';
    var SearchController = Controller.extend({

        beforeAction: function () {
            Controller.prototype.beforeAction.call(this, arguments);
            return this.performAccessControlChecks().then(undefined, _.bind(this.denyAccessControl, this))
        },

        performAccessControlChecks: function () {
            //var me = this;
            return new RSVP.Promise(function (fulfilled, rejected) {
                if (!AccessManager.isLogged()) {
                    //me.authorized = false;
                    rejected("auth");
                    return;
                }
                fulfilled();
            });
        },

        denyAccessControl: function (rejInfo) {
            if (rejInfo == "auth")
                this.authorized = false;
            //console.log(rejInfo);

            //this.authorized = false;
        },

        show: function (params, route, options) {
            if (this.authorized === false) {
                Chaplin.mediator.publish(Events.NOT_LOGGED);
                return;
            }
            this.bindEventListeners();

            this.view = new SearchView({
                model: this.model,
                region: 'main',
                query: options.query
            });

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();
            Controller.prototype.dispose.call(this, arguments);
        }
    });

    return SearchController;
});
