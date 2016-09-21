/*global define, _:false*/
define([
    'jquery',
    'backbone',
    'underscore',
    'loglevel',
    'fenix-ui-menu',
    '../../config/config-menu',
    '../views/view-landing',
    '../views/view-search'
], function ($, Backbone, _, log, FenixMenu, ConfigMenu, LandingView, SearchView) {

    'use strict';

    var s = {
        CONTAINER: '#fx-data-management-content',
        HOLDER: "#fx-data-management-content-holder"
    };

    return Backbone.Router.extend({

        // The Router constructor
        initialize: function (o) {

            _.extend(this, o);
            _.extend(this, Backbone.Events);

            this.initCommonViews();

            Backbone.history.start();
        },

        routes: {

            '(/)landing(/)': 'onLanding',
            '(/)search(/)': 'onSearch',
            '(/)not-found(/)': 'onNotFound',

            // ROUTE DEFAULT
            '(/)*path': 'onDefaultRoute'
        },

        initCommonViews: function () {
            log.info("Render common views");

            //render menu
            var fxmenu = new FenixMenu({
                    config : ConfigMenu
                });

        },

        //Landing

        onLanding: function () {

            log.info("onLanding called.");

            this.switchView(LandingView, {
                el: s.CONTAINER
            });
        },

        //Landing

        onSearch: function () {

            log.info("Search");

            log.info("onLanding called.");

            this.switchView(SearchView, {
                el: s.CONTAINER
            });
        },

        //Not found
        onNotFound: function () {
            log.info("Not found");
        },

        onDefaultRoute: function () {
            log.info("Default");

            this.goTo("#/not-found");
        },

        //Utils

        switchView: function (view, o) {

            if (this.currentView && this.currentView.remove) {
                this.currentView.remove();
                delete this.currentView;
                $(s.HOLDER).append('<div id="' + s.CONTAINER.substring(1) + '"></div>');
            }

            this.currentView = new view(o).render();
        },

        goTo: function (loc, trigger, replace) {
            this.navigate(loc, {trigger: trigger || true, replace: replace || true});
        }
    });
});