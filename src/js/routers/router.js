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
    "../../config/events",
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
], function ($, Backbone, _, log, Notify, NotifyConfig, Routes, C, EVT, Menu, ConfigMenu,
             LandingView, SearchView, NotFoundView, DeleteView, MetadataView, DSDView, DataView, HomeView,
             RM,
             labels) {

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
            log.info("Router params:");
            log.info(o);

            $.extend(true, this, {initial: o});

            this._parseInput();

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            Backbone.history.start();
            log.info("Backbone.history.start() success");
        },

        routes: Routes,

        _parseInput: function () {

            this.$el = this.initial.$el;
            this.container = this.initial.container || s.CONTAINER;
            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang;
            this.lang = this.lang.toLowerCase();

            this.config = this.initial.config;

            this.dsdEditorConfig = this.initial.dsdEditorConfig || {};
            this.catalogConfig = this.initial.catalogConfig || {};
            this.metadataEditorConfig = this.initial.metadataEditorConfig || {};
            this.dataEditorConfig = this.initial.dataEditorConfig || {};

        },

        _initVariables: function () {

            this.$viewsHolder = this.$el.find(s.HOLDER);
            this.$header = this.$el.find(s.HEADER);
            this.$pageTitle = this.$el.find(s.RES_TITLE);
        },

        _initComponents: function () {
            log.info("Render common views");

            Notify.options = NotifyConfig;

            RM.init({
                environment: this.environment,
                cache: this.cache
            });

            this._initMenu();

            log.info("Router components init: success");
        },

        _initMenu: function () {
            log.info("render menu");

            this.menu = new Menu({
                lang: this.lang,
                config: ConfigMenu,
                container: s.MENU
            });

            this._activateInitialMenuItems();
        },

        _activateInitialMenuItems: function () {
            this.menu.disable(C.menuItems);
            this.menu.activate(C.menuItemsEnabledOnStart);

            log.info("Activate menu initial items: success");
        },

        _activateValidResourceMenuItems: function () {

            this.menu.disable(C.menuItems);
            this.menu.activate(C.menuItemsEnableOnValidResource);

            log.info("Activate valid resource menu items: success");

        },

        _bindEventListeners: function () {

            var self = this;

            this.menu.on("select", function (evt) {
                log.info("Listen to menu event: " + evt.id);
                self.goTo("#/" + evt.id);
            });

            // RESOURCES

            // When a resource is created (new button)
            this.listenTo(Backbone, EVT.RESOURCE_CREATED, function () {
                log.info("[EVT] resource:new");
                Notify['info'](labels[self.lang]['resourceNew']);
                self._activateValidResourceMenuItems();
                self.goTo("#/metadata");
            });

            // When a resource is deleted (confirm is deletion)
            this.listenTo(Backbone, EVT.RESOURCE_DELETED, function () {
                log.info("[EVT] resource:deleted ", RM.resource);
                Notify['success'](labels[self.lang]['resourceDeleted']);
                self._activateInitialMenuItems();
                self.goTo("#/landing");
            });

            this.listenTo(Backbone, EVT.RESOURCE_LOAD, function (res) {
                log.info("[EVT] resource:loading ", res);

                if (this.waiting === true) {
                    log.warn("Abort loading resource because another one is already loading");

                    Notify['info'](labels[self.lang]['alreadyLoading']);

                    return;
                }

                this.waiting = true;

                RM.unloadResource();

                RM.loadResource(res);
            });

            // When a resource is in tentative deletion (still there)
            this.listenTo(Backbone, EVT.RESOURCE_DELETE, function () {
                log.info("[EVT] resource:delete ");
                RM.deleteResource();
            });

            // When a resource is loaded (fully)
            this.listenTo(Backbone, EVT.RESOURCE_LOADED, function () {
                log.info("[EVT] resource:loaded ");

                this.waiting = false;

                self._activateValidResourceMenuItems();

                Notify['success'](labels[self.lang]['resourceLoaded']);

                self.goTo("#/home");
            });

            // When a resource is unloaded (search or new is triggered)
            this.listenTo(Backbone, EVT.RESOURCE_UNLOADED, function () {
                log.info("[EVT] resource:unloaded ", RM.resource);
                self._activateInitialMenuItems();

            });

            // When the save button is clicked
            this.listenTo(Backbone, EVT.RESOURCE_UPDATED, function () {
                log.info("[EVT] resource:updated ", RM.resource);
                Notify['success'](labels[self.lang]['resourceSaved']);
                self.goTo("#/home");
            });

            // RESOURCES End

            this.listenTo(Backbone, "data:loading", function () {
                log.info("[EVT] data:loading ");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "data:loaded", function () {
                log.info("[EVT] data:loaded ");
                Notify['success'](labels[self.lang]['csvLoaded']);
            });

            this.listenTo(Backbone, "data:saving", function (res) {
                log.info("[EVT] data:saving");
                RM.setData(res);
                //TODO: Do some stuff here;
            });

            // METADATA

            this.listenTo(Backbone, EVT.METADATA_SAVE, function (res) {

                log.info("[EVT] meta:saving");

                RM.updateMetadata(res);

                RM.saveMetadata();

            });

            //DSD

            this.listenTo(Backbone, EVT.DSD_SAVE, function (dsd) {
                log.info("[EVT] dsd:saving");
                RM.updateDsd(dsd);

                RM.saveDsd();
            });

            // ERRORS

            this.listenTo(Backbone, "error:showerrormsg", function (message) {
                log.info("[EVT] error:showerrormsg ");
                Notify['error'](message);

                self.waiting = false;
            });

            this.listenTo(Backbone, "error:showerror", function (code, xhr) {
                log.info("[EVT] error:showerror ", code, xhr);
                var out = labels[this.lang][code] || JSON.stringify(xhr) || "Generic Error";
                Notify['error'](out);
            });

            this.listenTo(Backbone, "error:showerrorsrv", function (code, xhr) {
                log.info("[EVT] error:showerrorsrv ", code, xhr);
                var out = labels[this.lang][code] || "Server: " + JSON.stringify(xhr.responseJSON) || "Generic Error";
                Notify['error'](out);
            });

            this.listenTo(Backbone, EVT.METADATA_INFO, function (code, xhr) {
                log.info("[EVT] error:showerrorsrv ", code, xhr);
                var out = labels[this.lang][code] || "Server: " + JSON.stringify(xhr.responseJSON) || "Generic Error";
                Notify['info'](out);
            });

            // BUTTONS

            this.listenTo(Backbone, EVT.SHOW_ADD, function () {
                log.info("[EVT] button:new ");
                this.goTo("#/add");
            });

            this.listenTo(Backbone, EVT.SHOW_SEARCH, function () {
                log.info("[EVT] button:search ");
                this.goTo("#/search");
            });

            this.listenTo(Backbone, EVT.RESOURCE_DELETE_UNDO, function () {
                log.info("[EVT] button:undo ");
                this.goTo("#/home");
            });

            this.listenTo(Backbone, EVT.SHOW_METADATA, function () {
                log.info("[EVT] button:metadata ");
                this.goTo("#/metadata");
            });

            this.listenTo(Backbone, EVT.SHOW_DSD, function () {
                log.info("[EVT] button:dsd ");
                this.goTo("#/dsd");
            });

            this.listenTo(Backbone, EVT.SHOW_DATA, function () {
                log.info("[EVT] button:data ");
                this.goTo("#/data");
            });

            log.info("Router events binding: success");
        },

        //  ================================= ROUTING

        //Landing

        onLanding: function () {
            log.info("onLanding called.");

            this.switchView(LandingView, {
                el: this.container,
                menu: "landing",
                lang: this.lang
            });
        },

        //Home

        onHome: function () {
            log.info("onHome called.");

            this.switchView(HomeView, {
                el: this.container,
                menu: "home",
                lang: this.lang,
                environment: this.environment
            });
        },

        //Search

        onSearch: function () {
            log.info("onSearch called.");

            this.switchView(SearchView, {
                el: this.container,
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

            this.goTo("#/landing");
        },

        onClose: function () {
            log.info("Close - Routing to Landing");

            if (!$.isEmptyObject(RM.resource)) {
                RM.unloadResource();
                Notify['success'](labels[this.lang]['CloseHeader']);
            }

            this.goTo("#/landing");
        },

        // Add Resource

        onAdd: function () {
            log.info("Add Resource");

            RM.unloadResource();

            RM.createResource(this.config)

        },

        // Metadata View

        onMetadata: function () {
            log.info("Metadata View");

            // Init Buttons
            this.switchView(MetadataView, {
                el: this.container,
                menu: "metadata",
                lang: this.lang,
                environment: this.environment,
                config: this.metadataEditorConfig,
                model: RM.getMetadata()
            });
        },

        // DSD View

        onDSD: function () {

            log.info("DSD View");

            // Init Buttons
            this.switchView(DSDView, {
                el: this.container,
                menu: "dsd",
                lang: this.lang,
                environment: this.environment,
                config: $.extend(true, this.dsdEditorConfig, {
                    lang : this.lang,
                    contextSystem: this.config.contextSystem,
                    datasources: this.config.datasources
                }),
                model: RM.getDSD(),
                isEditable: RM.isDSDEditable()
            });
        },

        // Data View

        onData: function () {
            log.info("Data View");

            this.switchView(DataView, {
                el: this.container,
                menu: "data",
                config : this.dataEditorConfig,
                lang: this.lang,
                codelists: RM.getCurrentResourceCodelists(),
                dsd: RM.getDSD(),
                data: RM.getData(),
                generator: RM.generateDSDStructure(),
                environment: this.environment
            });
        },

        // Delete Resource

        onDelete: function () {
            log.info("Delete Resource");
            this.switchView(DeleteView, {
                el: this.container,
                menu: "delete",
                lang: this.lang,
                environment: this.environment
            });
        },

        //Not found

        onNotFound: function () {

            log.info("Not found");

            this.switchView(NotFoundView, {
                el: this.container,
                lang: this.lang
            });
        },

        onDefaultRoute: function () {
            log.info("Default");

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

            this._updatePageTitle();

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

            this.menu.select(o.menu);

            this.currentView = new View(o).render(o);

        },

        _updatePageTitle: function () {

            var stringTitle = "";
            this.$header.html(this.menu.o.active);

            if ($.isPlainObject(RM.resource.metadata)) {
                if (RM.resource.metadata.title) {
                    stringTitle = ' / ' + RM.resource.metadata.title[this.lang.toUpperCase()];
                } else {
                    stringTitle = ' / ' + labels[this.lang.toLowerCase()]['NoTitle'];
                }
            }
            this.$pageTitle.html(stringTitle);

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