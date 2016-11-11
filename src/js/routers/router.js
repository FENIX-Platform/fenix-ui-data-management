/*global define, _:false*/
define([
    'jquery',
    'backbone',
    'underscore',
    'loglevel',
    "toastr",
    "../../config/notify",
    "../../config/routes",
    "../../config/config",
    'fenix-ui-menu',
    '../../config/menu',
    '../views/landing',
    '../views/search',
    '../views/notFound',
    '../views/delete',
    '../views/metadata',
    '../views/dsd',
    '../views/data',
    '../views/home',
    '../components/resource-manager',
    '../../nls/labels'
], function ($, Backbone, _, log, Notify, ConfigNotify, Routes, C, Menu, ConfigMenu,
             LandingView, SearchView, NotFoundView, DeleteView, MetadataView, DSDView, DataView, HomeView,
             RM,
             MultiLang) {

    'use strict';

    var s = {
            MENU: '#fx-data-management-menu',
            CONTAINER: '#fx-data-management-content',
            HOLDER: "#fx-data-management-content-holder",
            BTN_CONTAINER: "#fx-data-managment-update-model-holder",
            BTN_ELEMENT: "#fx-data-managment-update-button",
            HEADER: "#fx-data-managment-header-title",
            RES_TITLE: "#fx-data-managment-resource-title"
        };

    return Backbone.Router.extend({

        // The Router constructor
        initialize: function (o) {

            log.info("Data Management - Router", o);

            $.extend(true, this, {initial: o});

            this._parseInput();

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            Backbone.history.start();
        },

        routes: Routes,

        _parseInput: function () {

            this.$el = this.initial.$el;
            this.container = this.initial.container || s.CONTAINER;
            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang ||C.lang ;

            this.config = this.initial.config;

            this.dsdEditor = this.initial.dsdEditor;
            this.catalog = this.initial.catalog;
            this.metadataEditor = this.initial.metadataEditor;

        },

        _initVariables: function () {
            this.$viewsHolder = this.$el.find(s.HOLDER);
        },

        _initComponents: function () {
            log.info("Render common views");

            Notify.options = ConfigNotify;

            this._initMenu();
        },

        _initMenu: function () {
            log.info("render menu");

            this.menu = new Menu({
                lang: this.lang,
                config: ConfigMenu,
                container: s.MENU
            });

            this._activateIntialMenuItems();
        },

        _activateIntialMenuItems: function () {

            this.menu.disable(C.menuItems);
            this.menu.activate(C.menuItemsEnabledOnStart);
        },

        _activateValidResourceMenuItems: function () {
            this.menu.disable(C.menuItems);
            this.menu.activate(C.menuItemsEnableOnValidResource);
        },

        _bindEventListeners: function () {
            log.info("bindEventListeners");
            var self = this;

            // Menu Event Listener
            this.menu.on("select", function (evt) {
                //console.log("select menu is fired", evt);
                self.goTo("#/" + evt.id);
            });

            // RESOURCES

            // When a resource is created (new button)
            this.listenTo(Backbone, "resource:new", function () {
                log.info("[EVT] resource:new ", RM.resource);
                Notify['info'](MultiLang[self.lang.toLowerCase()]['resourceNew']);
                self.menuActivated();
                self.goTo("#/metadata");
            });

            // When a resource is deleted (confirm is deletion)
            this.listenTo(Backbone, "resource:deleted", function () {
                log.info("[EVT] resource:deleted ", RM.resource);
                Notify['success'](MultiLang[self.lang.toLowerCase()]['resourceDeleted']);
                self.menuInitial();
                self.goTo("#/landing");
            });

            // When a resource is loading (catalog search selected)
            this.listenTo(Backbone, "resource:loading", function (res) {
                log.info("[EVT] resource:loading ", res);
                RM.unloadResource();
                RM.loadResource(res);
            });

            // When a resource is in tentative deletion (still there)
            this.listenTo(Backbone, "resource:delete", function () {
                log.info("[EVT] resource:delete ", RM.resource);
                RM.deleteResource();
            });

            // When a resource is loaded (fully)
            this.listenTo(Backbone, "resource:loaded", function () {
                log.info("[EVT] resource:loaded ", RM.resource);
                self.menuActivated();
                Notify['success'](MultiLang[self.lang.toLowerCase()]['resourceLoaded']);
                self.goTo("#/home");
            });

            // When a resource is unloaded (search or new is triggered)
            this.listenTo(Backbone, "resource:unloaded", function () {
                log.info("[EVT] resource:unloaded ", RM.resource);
                self.menuInitial();

            });

            // When the save button is clicked
            this.listenTo(Backbone, "resource:updated", function () {
                log.info("[EVT] resource:updated ", RM.resource);
                log.info("Load again because...");
                RM.getFullMetadataFromServer();
                Notify['success'](MultiLang[self.lang.toLowerCase()]['resourceSaved']);
                self.goTo("#/home");
            });

            // RESOURCES End

            this.listenTo(Backbone, "data:loading", function () {
                log.info("[EVT] data:loading ");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "data:loaded", function () {
                log.info("[EVT] data:loaded ");
                Notify['success'](MultiLang[self.lang.toLowerCase()]['csvLoaded']);
            });

            this.listenTo(Backbone, "data:saving", function (res) {
                log.info("[EVT] data:saving");
                RM.setData(res);
                //TODO: Do some stuff here;
            });

            // METADATA

            this.listenTo(Backbone, "meta:loading", function () {
                log.info("[EVT] meta:loading");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "meta:saving", function (res) {
                log.info("[EVT] meta:saving");
                RM.setMetadata(res);
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "meta:loaded", function () {
                log.info("[EVT] meta:loaded");
                //TODO: Do some stuff here;
            });

            // DSD
            this.listenTo(Backbone, "dsd:new", function (res) {
                log.info("[EVT] dsd:new", res);
                RM.setDSDwithMeta(res);
            });

            this.listenTo(Backbone, "dsd:saving", function (res) {
                log.info("[EVT] dsd:saving");
                RM.setDSD(res);
            });

            this.listenTo(Backbone, "dsd:setcolumns", function (res) {
                log.info("[EVT] dsd:setcolumns");
                RM.setDSDColumns(res);
            });

            this.listenTo(Backbone, "dsd:loading", function () {
                log.info("[EVT] dsd:loading");
            });

            this.listenTo(Backbone, "dsd:loaded", function () {
                log.info("[EVT] dsd:loaded ");
                //TODO: Do some stuff here;
            });

            // ERRORS

            this.listenTo(Backbone, "error:showerrormsg", function (message) {
                log.info("[EVT] error:showerrormsg ");
                Notify['error'](message);
            });

            this.listenTo(Backbone, "error:showerror", function (code, xhr) {
                log.info("[EVT] error:showerror ", code, xhr);
                var out = MultiLang[this.lang.toLowerCase()][code] || JSON.stringify(xhr) || "Generic Error";
                Notify['error'](out);
            });

            this.listenTo(Backbone, "error:showerrorsrv", function (code, xhr) {
                log.info("[EVT] error:showerrorsrv ", code, xhr);
                var out = MultiLang[this.lang.toLowerCase()][code] || "Server: " + JSON.stringify(xhr.responseJSON) || "Generic Error";
                Notify['error'](out);
            });

            // BUTTONS

            this.listenTo(Backbone, "button:new", function () {
                log.info("[EVT] button:new ");
                this.goTo("#/add");
            });

            this.listenTo(Backbone, "button:search", function () {
                log.info("[EVT] button:search ");
                this.goTo("#/search");
            });

            this.listenTo(Backbone, "button:undo", function () {
                log.info("[EVT] button:undo ");
                this.goTo("#/home");
            });

            this.listenTo(Backbone, "button:metadata", function () {
                log.info("[EVT] button:metadata ");
                this.goTo("#/metadata");
            });

            this.listenTo(Backbone, "button:dsd", function () {
                log.info("[EVT] button:dsd ");
                this.goTo("#/dsd");
            });

            this.listenTo(Backbone, "button:data", function () {
                log.info("[EVT] button:data ");
                this.goTo("#/data");
            });

        },

        //  Views

        //Landing

        onLanding: function () {
            log.info("onLanding called.");

            this.switchView(LandingView, {
                el :this.container,
                menu: "landing",
                lang: this.lang
            });

        },

        //Home

        onHome: function () {
            log.info("onHome called.");

            this.switchView(HomeView, {
                el :this.container,
                menu: "home",
                lang: this.lang,
                environment: this.environment
            });
        },

        //Search

        onSearch: function () {
            log.info("onSearch called.");

            this.switchView(SearchView, {
                el :this.container,
                menu: "search",
                lang: this.lang,
                cache: this.cache,
                environment: this.environment,
                catalog: this.catalog
            });
        },

        //Denied

        onDenied: function () {
            log.info("Denied - Routing to Lading");
            $(this.$el.find(s.BTN_CONTAINER)).hide();
            this.goTo("#/landing");
        },

        onClose: function () {
            log.info("Close - Routing to Landing");
            if (!$.isEmptyObject(RM.resource)) {
                RM.unloadResource();
                Notify['success'](MultiLang[this.lang.toLowerCase()]['CloseHeader']);
            }
            this.goTo("#/landing");
        },

        // Add Resource

        onAdd: function () {
            log.info("Add Resource");
            log.warn("Avoid to render the resource and directly cast the event");
            if ($.isEmptyObject(RM.resource)) RM.newResource(this.config);
        },

        // Metadata View

        onMetadata: function () {
            log.info("Metadata View");
            // Init Buttons
            $(this.$el.find(s.BTN_CONTAINER)).show();
            this.switchView(MetadataView, {
                el :this.container,
                menu: "metadata",
                lang: this.lang,
                environment: this.environment,
                config: this.metadataEditor,
                model: RM.getMetadata(),
                savebtn: s.BTN_ELEMENT
            });
        },

        // DSD View

        onDSD: function () {
            log.info("DSD View");
            // Init Buttons
            $(this.$el.find(s.BTN_CONTAINER)).show();
            this.switchView(DSDView, {
                el :this.container,
                menu: "dsd",
                lang: this.lang,
                environment: this.environment,
                config: this.dsdEditor,
                model: RM.getDSD(),
                isEditable: RM.isDSDEditable(),
                savebtn: s.BTN_ELEMENT
            });
        },

        // Data View

        onData: function () {
            log.info("Data View");
            // Init Buttons
            $(this.$el.find(s.BTN_CONTAINER)).show();
            this.switchView(DataView, {
                el :this.container,
                menu: "data",
                lang: this.lang,
                codelists: RM.getCurrentResourceCodelists(),
                dsd: RM.getDSD(),
                data: RM.getData(),
                generator: RM.generateDSDStructure(),
                environment: this.environment,
                savebtn: s.BTN_ELEMENT
            });
        },

        // Delete Resource

        onDelete: function () {
            log.info("Delete Resource");
            $(this.$el.find(s.BTN_CONTAINER)).hide();
            this.switchView(DeleteView, {
                el :this.container,
                menu: "delete",
                lang: this.lang,
                environment: this.environment
            });
        },

        //Not found

        onNotFound: function () {
            log.info("Not found");
            $(this.$el.find(s.BTN_CONTAINER)).hide();
            this.switchView(NotFoundView, {
                el :this.container,
                lang: this.lang
            });
        },

        onDefaultRoute: function () {
            log.info("Default");
            $(this.$el.find(s.BTN_CONTAINER)).hide();
            this.goTo("#/not-found");
        },

        //Utils

        switchView: function (View, o) {

            if (this.currentViewCreator === View) {
                log.warn("Abort switch view because candidate view is current view");
                return;
            }
            this.currentViewCreator = View;

            log.info("Switch view");

            var self = this,
                candidate = new View(o);

            if (typeof candidate.accessControl === "function") {
                log.info("View has access control", RM.resource);
                candidate.accessControl(RM.resource).then(
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

        renderView: function (View, o) {
            var candidate = new View(o);


            //update title
            var stringTitle = "";
            this.currentView = candidate.render(o);
            this.menu.select(o.menu);
            $(this.$el.find(s.HEADER)).html(this.menu.o.active);
            if ($.isPlainObject(RM.resource.metadata)) {
                if (RM.resource.metadata.title) {
                    stringTitle = ' / ' + RM.resource.metadata.title[this.lang];
                } else {
                    stringTitle = ' / ' + MultiLang[this.lang.toLowerCase()]['NoTitle'];
                }
            }
            $(this.$el.find(s.RES_TITLE)).html(stringTitle);
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
            this.$viewsHolder.html('<div id="' + s.CONTAINER.substring(1) + '"></div>');
            log.info("Add view container: success");
        },

        goTo: function (loc, trigger, replace) {
            this.navigate(loc, {trigger: !!trigger, replace: !!replace});
        }
    });
});