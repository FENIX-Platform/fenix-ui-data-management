define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/landing-view',
    'fx-d-m/views/site-view'
], function (Chaplin, Controller, LandingView, SiteView) {

    'use strict';

    var LandingController = Controller.extend({

        show: function (params, route, options) {

            this.view = new LandingView({
                model: this.model,
                region: 'main',
                query: options.query
            });

        }
    });

    return LandingController;

});
