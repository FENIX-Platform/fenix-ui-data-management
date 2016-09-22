/*global define, _:false*/
define([
    'jquery',
    'backbone',
    'underscore',
    'loglevel',
    'fenix-ui-menu',
    '../../config/config-menu',
    '../views/landing',
    '../views/search',
    '../views/notFound',
    '../views/denied',
], function ($, Backbone, _, log, Menu, ConfigMenu, LandingView, SearchView, NotFoundView, DeniedView) {

    'use strict';

    var s = {
        CONTAINER: '#fx-data-management-content',
        HOLDER: "#fx-data-management-content-holder"
    };

    return Backbone.Router.extend({

        // The Router constructor
        initialize: function (o) {

            $.extend(true, this, o);

            this.initCommonViews();

            this.initVariables();

            Backbone.history.start();
        },

        routes: {
            '(/)': 'onLanding',

            '(/)landing(/)': 'onLanding',

            '(/)search(/)': 'onSearch',
            '(/)not-found(/)': 'onNotFound',

            '(/)denied(/)': 'onDenied',

            // fallback route
            '(/)*path': 'onDefaultRoute'
        },

        initCommonViews: function () {
            log.info("Render common views");

            //render menu
            this.menu = new Menu({
                config: ConfigMenu
            });

        },

        initVariables: function () {
            this.$viewsHolder = this.$el.find(s.HOLDER);
        },

        //Landing

        onLanding: function () {

            log.info("onLanding called.");

            this.switchView(LandingView, {
                el: s.CONTAINER,
                menu : "landing"
            });
        },

        //Search

        onSearch: function () {

            log.info("Search");

            log.info("onLanding called.");

            this.switchView(SearchView, {
                el: s.CONTAINER,
                menu : "search"
            });
        },

        //Denied

        onDenied: function () {
            log.info("Denied");

            this.switchView(DeniedView, {
                el: s.CONTAINER
            });
        },

        //Not found

        onNotFound: function () {
            log.info("Not found");
            this.switchView(NotFoundView, {
                el: s.CONTAINER
            });
        },

        onDefaultRoute: function () {
            log.info("Default");

            this.goTo("#/not-found");
        },

        //Utils

        switchView: function (View, o) {

            if (this.currentViewCreator === View) {
                log.warn("Abort switch view because candidate view is current view")
                return;
            }

            this.currentViewCreator = View;

            log.info("Switch view");

            var self = this,
                candidate = new View(o);

            if (typeof candidate.accessControl === "function") {

                log.info("View has access control");

                candidate.accessControl().then(
                    function () {
                        log.warn("Access control: granted");

                        self.resetView();

                       self.renderView(View, o);

                    },
                    function () {
                        log.warn("Access control: DENIED");

                        self.resetView();

                        self.onDenied()
                    });

            }
            else {
                log.info("View has NOT access control");

                this.resetView();

                this.renderView(View, o)

            }

        },

        resetView: function () {
            this.disposeCurrentView();

            this.addViewContainer();
        },

        renderView : function (View, o) {

            var candidate = new View(o);

            this.currentView = candidate.render();

            this.menu.select(o.menu);

        },

        disposeCurrentView: function () {

            if (this.currentView && this.currentView.remove) {
                this.currentView.remove();
                delete this.currentView;
                log.info("Removed current view");

            }
            log.info("Dispose current view: success");

        },

        addViewContainer: function () {
            this.$viewsHolder.append('<div id="' + s.CONTAINER.substring(1) + '"></div>');
            log.info("Add view container: success");

        },

        goTo: function (loc, trigger, replace) {
            this.navigate(loc, {trigger: !!trigger, replace: !!replace});
        }
    });
});