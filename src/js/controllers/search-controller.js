/*global amplify, define*/
define([
    'chaplin',
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/search-view',
    'fx-d-m/config/events',
    'amplify'
], function (Chaplin, Controller, SearchView, Events) {

    'use strict';

    var SearchController = Controller.extend({

        show: function (params, route, options) {

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
