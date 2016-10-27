/*global define, _:false*/
define([
    'jquery',
    'backbone',
    'underscore',
    'loglevel',
    "toastr",
    "../../config/notify",
    'fenix-ui-menu',
    '../../config/menu',
    '../views/landing',
    '../views/search',
    '../views/notFound',
    '../views/denied',
    '../views/add',
    '../views/delete',
    '../views/metadata',
    '../views/dsd',
    '../views/data',
    '../views/home',
    '../components/resource-manager',
    '../../nls/labels'
], function ($, Backbone, _, log, Notify, ConfigNotify, Menu, ConfigMenu,
             LandingView, SearchView, NotFoundView, DeniedView, AddView, DeleteView, MetadataView, DSDView, DataView, HomeView,
             RM,
             MultiLang
) {

    'use strict';

    var s = {
        MENU: '#fx-data-management-menu',
        CONTAINER: '#fx-data-management-content',
        HOLDER: "#fx-data-management-content-holder",
        BTN_CONTAINER: "#fx-data-managment-update-model-holder",
        BTN_ELEMENT : "#fx-data-managment-update-button",
        HEADER : "#fx-data-managment-header-title",
        RES_TITLE: "#fx-data-managment-resource-title"
    };

    return Backbone.Router.extend({

        // The Router constructor
        initialize: function (o) {
            log.info("Data Management - Router",o);
            $.extend(true, this, o);

            this.initCommonViews();
            this.initVariables();
            this.bindEventListeners();

            Backbone.history.start();
        },

        routes: {
            '(/)': 'onLanding',
            '(/)landing(/)': 'onLanding',

            '(/)home(/)': 'onHome',
            '(/)add(/)': 'onAdd',

            '(/)metadata(/)': 'onMetadata',
            '(/)dsd(/)': 'onDSD',
            '(/)data(/)': 'onData',

            '(/)close(/)' : 'onClose',
            '(/)delete(/)': 'onDelete',
            '(/)search(/)': 'onSearch',
            '(/)not-found(/)': 'onNotFound',

            '(/)denied(/)': 'onDenied',

            // fallback route
            '(/)*path': 'onDefaultRoute'
        },

        initCommonViews: function () {
            log.info("Render common views");
            // Init Buttons
            Notify.options = ConfigNotify;
            $(s.BTN_ELEMENT).html(MultiLang[this.lang.toLowerCase()]['btnSave']);
            $(s.BTN_CLOSE).html(MultiLang[this.lang.toLowerCase()]['btnClose']);
            $(s.BTN_CONTAINER).hide();
            this.initMenu();
        },

        initMenu: function() {
            log.info("render menu");
            var self = this;

            this.menu = new Menu({
                lang: self.lang,
                config: ConfigMenu,
                container: s.MENU
            });
            this.menuInitial();
        },

        menuInitial: function() {
            var self = this;
            var disabledByDefault = ['delete','metadata','dsd','data','home','close']
            $.each(disabledByDefault, function(index,object){
                self.menu.disableItem(object);
            });
            self.menu.activateItem('add');
            $(s.BTN_CONTAINER).hide();

        },

        menuActivated: function() {
            var self = this,
                enableOnValidResource = ['delete','metadata','dsd','data','home','close'];
            $.each(enableOnValidResource, function(index,object){
                self.menu.activateItem(object);
            });
            self.menu.disableItem('add');
        },

        initVariables: function () {
            this.$viewsHolder = this.$el.find(s.HOLDER);
        },

        bindEventListeners: function () {
            log.info("bindEventListeners");
            var self = this;
            // Menu Event Listener
            this.menu.on("select", function(evt){
                self.goTo("#/"+evt.id);
            });

            // When a resource is loaded
            this.listenTo(Backbone,"resource:loaded", function(){
                log.info("[EVT] resource:loaded ", RM.resource);
                this.menuActivated();
                Notify['success'](MultiLang[this.lang.toLowerCase()]['resourceLoaded']);
                this.goTo("#/home");
            });
            // When a resource is unloaded (search or new is triggered)
            this.listenTo(Backbone,"resource:unloaded", function(){
                log.info("[EVT] resource:unloaded ", RM.resource);
                this.menuInitial();

            });
            // When the save button is clicked
            this.listenTo(Backbone, "resource:updated", function() {
                log.info("[EVT] resource:updated ", RM.resource);
                Notify['success'](MultiLang[this.lang.toLowerCase()]['resourceSaved']);
                this.goTo("#/home");
            });

            this.listenTo(Backbone, "data:loading", function() {
                log.info("[EVT] data:loading ");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "data:loaded", function() {
                log.info("[EVT] data:loaded ");
                //TODO: Do some stuff here;
            });
            this.listenTo(Backbone, "meta:loading", function() {
                log.info("[EVT] meta:loading");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "meta:loaded", function() {
                log.info("[EVT] meta:loaded");
                //TODO: Do some stuff here;
            });
            this.listenTo(Backbone, "dsd:loading", function() {
                log.info("[EVT] dsd:loading");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "dsd:loaded", function() {
                log.info("[EVT] dsd:loaded ");
                //TODO: Do some stuff here;
            });


            this.listenTo(Backbone, "resource:new", function() {
                log.info("[EVT] resource:new ", RM.resource);
                Notify['info'](MultiLang[this.lang.toLowerCase()]['resourceNew']);
                this.menuActivated();
                this.goTo("#/metadata");
            });

            this.listenTo(Backbone, "resource:deleted", function() {
                log.info("[EVT] resource:deleted ", RM.resource);
                Notify['success'](MultiLang[this.lang.toLowerCase()]['resourceDeleted']);
                this.menuInitial();
                this.goTo("#/landing");
            });

            this.listenTo(Backbone, "error:showerror", function(code, xhr){
                log.info("[EVT] error:showerror ", code, xhr);
                var out = MultiLang[this.lang.toLowerCase()][code] || JSON.stringify(xhr) || "Generic Error";
                Notify['error'](out);
            });


        },

        //  Views

        //Landing

        onLanding: function () {
            log.info("onLanding called.");
            this.switchView(LandingView, {
                el: s.CONTAINER,
                menu : "landing",
                lang : this.lang,
                router: this,
                environment: this.environment
            });
            this.menuInitial();
        },

        //Home

        onHome: function () {
            log.info("onHome called.");
            $(s.BTN_CONTAINER).hide();
            this.switchView(HomeView, {
                el: s.CONTAINER,
                menu : "home",
                lang : this.lang,
                router: this,
                environment: this.environment
            });
        },


        //Search

        onSearch: function () {
            log.info("onSearch called.");
            //log.warn("TODO: Check if this search is voluntary [if Resource is loaded]");
            $(s.BTN_CONTAINER).hide();
            this.switchView(SearchView, {
                el: s.CONTAINER,
                menu : "search",
                lang : this.lang,
                environment: this.environment,
                catalog: this.catalog,
            });
        },

        //Denied

        onDenied: function () {
            log.info("Denied - Routing to Lading");
            $(s.BTN_CONTAINER).hide();
            this.goTo("#/landing");
        },

        onClose: function () {
            log.info("Close - Routing to Lading");
            RM.unloadResource();
            Notify['success'](MultiLang[this.lang.toLowerCase()]['CloseHeader']);
            this.goTo("#/landing");

        },

        // Add Resource

        onAdd: function () {
            log.info("Add Resource");
            $(s.BTN_CONTAINER).hide();
            this.switchView(AddView, {
                el: s.CONTAINER,
                lang : this.lang,
                environment: this.environment,
                config: this.config
            });
        },

        // Metadata View

        onMetadata: function () {
            log.info("Metadata View");
            // Init Buttons
            $(s.BTN_CONTAINER).show();
            this.switchView(MetadataView, {
                el: s.CONTAINER,
                menu : "metadata",
                lang : this.lang,
                config: this.metadataEditor,
                environment: this.environment,
                savebtn : s.BTN_ELEMENT
            });
        },

        // DSD View

        onDSD: function () {
            log.info("DSD View");
            // Init Buttons
            $(s.BTN_CONTAINER).show();
            this.switchView(DSDView, {
                el: s.CONTAINER,
                menu : "dsd",
                lang : this.lang,
                environment: this.environment,
                config: this.dsdEditor,
                savebtn : s.BTN_ELEMENT
            });
        },

        // Data View

        onData: function () {
            log.info("Data View");
            // Init Buttons
            $(s.BTN_CONTAINER).show();
            this.switchView(DataView, {
                el: s.CONTAINER,
                menu : "data",
                lang : this.lang,
                environment: this.environment,
                savebtn : s.BTN_ELEMENT
            });
        },

        // Delete Resource

        onDelete: function () {
            log.info("Delete Resource");
            $(s.BTN_CONTAINER).hide();
            this.switchView(DeleteView, {
                el: s.CONTAINER,
                menu : "delete",
                lang : this.lang,
                router : this,
                environment: this.environment
            });
        },

        //Not found

        onNotFound: function () {
            log.info("Not found");
            $(s.BTN_CONTAINER).hide();
            this.switchView(NotFoundView, {
                el: s.CONTAINER,
                lang : this.lang,
                environment: this.environment
            });
        },

        onDefaultRoute: function () {
            log.info("Default");
            $(s.BTN_CONTAINER).hide();
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
                        log.warn("Access control: GRANTED");
                        self.resetView();
                        self.renderView(View, o);

                    },
                    function () {
                        log.warn("Access control: DENIED");
                        self.resetView();
                        self.onDenied()
                    }
                );
            } else {
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
            this.currentView = candidate.render(o);
            this.menu.select(o.menu);
            $(s.HEADER).html(this.menu.o.active)
            if ((RM.resource.metadata !== undefined) &&
                (RM.resource.metadata.title !== undefined) )
                $(s.RES_TITLE).html(' / '+RM.resource.metadata.title[this.lang]);
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