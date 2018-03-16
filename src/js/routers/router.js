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
    '../components/resource-manager-gift',
    '../../nls/labels'
], function ($, Backbone, _, log, Notify, NotifyConfig, Routes, C, EVT, Menu, ConfigMenu,
             LandingView, SearchView, NotFoundView, DeleteView, MetadataView, DSDView, DataView, HomeView,
             RM, RMGift,
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
    },
        r = Routes;

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

        routes: r,

        _parseInput: function () {

            this.$el = this.initial.$el;
            this.container = this.initial.container || s.CONTAINER;
            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang;
            this.lang = this.lang.toLowerCase();

            this.notifyConfig = this.initial.notifyConfig || NotifyConfig;

            this.config = this.initial.config;

            this.dsdEditorConfig = this.initial.dsdEditorConfig || {};
            this.catalogConfig = this.initial.catalogConfig || {};
            this.metadataEditorConfig = this.initial.metadataEditorConfig || {};
            this.dataEditorConfig = this.initial.dataEditorConfig || {};
            this.menuConfig = this.initial.menuConfig || ConfigMenu;

            this.metadataConverters = this.initial.metadataConverters;

            this.disabledSections = this.initial.disabledSections || [];

            this.metadataEnvironment = this.initial.metadataEnvironment || this.environment;
            this.catalogEnvironment = this.initial.catalogEnvironment || this.environment;
            this.dmEnvironment = this.initial.dmEnvironment || this.environment;

            this.extraBridge = this.initial.extraBridge || false;

            this.resourceManager = this.initial.resourceManager || "default";

            (this.resourceManager == "default") ? this.RM = RM : this.RM = RMGift;

            console.log(this.RM);

            r = this.initial.routes || r;

        },

        _initVariables: function () {

            this.$viewsHolder = this.$el.find(s.HOLDER);
            this.$header = this.$el.find(s.HEADER);
            this.$pageTitle = this.$el.find(s.RES_TITLE);
        },

        _initComponents: function () {
            log.info("Render common views");

            Notify.options = this.notifyConfig.errors;

            this.RM.init({
                environment: this.dmEnvironment,
                cache: this.cache,
                extra: this.extraBridge
            });

            this._initMenu();

            log.info("Router components init: success");
        },

        _initMenu: function () {
            log.info("render menu");

            this.menu = new Menu({
                lang: this.lang,
                config: this.menuConfig,
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
                Notify['info'](labels[self.lang]['resourceNew'], "" ,this.notifyConfig.info);
                self._activateValidResourceMenuItems();
                self.goTo("#/metadata");
            });

            // When a resource is deleted (confirm is deletion)
            this.listenTo(Backbone, EVT.RESOURCE_DELETED, function () {
                log.info("[EVT] resource:deleted ", this.RM.resource);
                Notify['success'](labels[self.lang]['resourceDeleted'], "" ,this.notifyConfig.info);
                self._activateInitialMenuItems();
                self.goTo("#/landing");
            });

            this.listenTo(Backbone, EVT.RESOURCE_LOAD, function (res) {
                log.info("[EVT] resource:loading ", res);

                if (this.waiting === true) {
                    log.warn("Abort loading resource because another one is already loading");
                    Notify['info'](labels[self.lang]['alreadyLoading'], "" ,this.notifyConfig.info);
                    return;
                }

                this.waiting = true;

                this.RM.unloadResource();
                this.RM.loadResource(res);
            });

            // When a resource is in tentative deletion (still there)
            this.listenTo(Backbone, EVT.RESOURCE_DELETE, function () {
                log.info("[EVT] resource:delete");
                this.RM.deleteResource();
            });

            // When a resource is loaded (fully)
            this.listenTo(Backbone, EVT.RESOURCE_LOADED, function () {
                log.info("[EVT] resource:loaded ");
                this.waiting = false;
                self._activateValidResourceMenuItems();
                Notify['success'](labels[self.lang]['resourceLoaded'], "" ,this.notifyConfig.info);
                self.goTo("#/home");
            });

            // When a resource is unloaded (search or new is triggered)
            this.listenTo(Backbone, EVT.RESOURCE_UNLOADED, function () {
                log.info("[EVT] resource:unloaded ", this.RM.resource);
                self._activateInitialMenuItems();
            });

            // When the save button is clicked
            this.listenTo(Backbone, EVT.RESOURCE_UPDATED, function () {
                log.info("[EVT] resource:updated ", this.RM.resource);
                Notify['success'](labels[self.lang]['resourceSaved'], "" ,this.notifyConfig.info);
                self.goTo("#/home");
            });

            // RESOURCES End

            this.listenTo(Backbone, "data:loading", function () {
                log.info("[EVT] data:loading ");
                //TODO: Do some stuff here;
            });

            this.listenTo(Backbone, "data:loaded", function () {
                log.info("[EVT] data:loaded ");
                Notify['success'](labels[self.lang]['csvLoaded'], "" ,this.notifyConfig.info);
            });

            this.listenTo(Backbone, "data:saving", function (res) {
                log.info("[EVT] data:saving");
                this.RM.setData(res);
            });

            // METADATA

            this.listenTo(Backbone, EVT.METADATA_CREATE, function (res) {
                log.info("[EVT] meta:creating");
                this.RM.updateMetadata(res);
                this.RM.createResource(this.config);
            });


            this.listenTo(Backbone, EVT.METADATA_SAVE, function (res) {
                log.info("[EVT] meta:saving");
                this.RM.updateMetadata(res);
                this.RM.saveMetadata();
            });

            this.listenTo(Backbone, EVT.METADATA_COPY_EMPTY_RESOURCE, function () {
                Notify['warning'](labels[this.lang][EVT.METADATA_COPY_EMPTY_RESOURCE], "" ,this.notifyConfig.info);
            });

            this.listenTo(Backbone, EVT.METADATA_COPY_SUCCESS, function () {
                Notify['success'](labels[this.lang][EVT.METADATA_COPY_SUCCESS], "" ,this.notifyConfig.info);
            });

            // When a metadata is in tentative deletion (still there)
            this.listenTo(Backbone, EVT.METADATA_DELETE, function () {
                log.info("[EVT] METADATA_DELETE ");
                this.RM.deleteMetadata();
            });

            //DSD

            this.listenTo(Backbone, EVT.DSD_SAVE, function (dsd) {
                log.info("[EVT] dsd:saving");
                this.RM.updateDsd(dsd);
                this.RM.saveDsd();
            });

            this.listenTo(Backbone, EVT.DSD_COPY_EMPTY_RESOURCE, function (dsd) {
                Notify['warning'](labels[this.lang][EVT.DSD_COPY_EMPTY_RESOURCE], "" ,this.notifyConfig.info);
            });

            this.listenTo(Backbone, EVT.DSD_COPY_SUCCESS, function (dsd) {
                Notify['success'](labels[this.lang][EVT.DSD_COPY_SUCCESS], "" ,this.notifyConfig.info);
            });

            // ERRORS

            this.listenTo(Backbone, "error:showerrormsg", function (message) {
                log.info("[EVT] error:showerrormsg >>", message);
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
                var out = labels[this.lang][code] || "Server: " + JSON.stringify((xhr.responseJSON != undefined)? xhr.statusText : xhr.responseJSON) || "Generic Error";
                Notify['error'](out);
            });

            this.listenTo(Backbone, EVT.METADATA_INFO, function (code, xhr) {
                log.info("[EVT] error:showerrorsrv ", code, xhr);
                var out = labels[this.lang][code] || "Server: " + JSON.stringify((xhr.responseJSON != undefined)? xhr.statusText : xhr.responseJSON) || "Generic Error";
                Notify['info'](out);
            });

            this.listenTo(Backbone, EVT.DSD_INFO, function (code, xhr) {
                log.info("EVT.DSD_INFO", code, xhr);
                var out = labels[this.lang][code];
                //console.log(' EVT.DSD_INFO', out );
                //Notify['info'](out);
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
                disabledSections: this.disabledSections,
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
                environment: this.catalogEnvironment,
                catalog: this.catalogConfig
            });
        },

        //Denied

        onDenied: function () {
            log.info("Denied - Routing to Lading");

            this.goTo("#/landing");
        },

        onClose: function () {
            log.info("Close - Routing to Landing");

            if (!$.isEmptyObject(this.RM.resource)) {
                this.RM.unloadResource();
                Notify['success'](labels[this.lang]['CloseHeader'], "" ,this.notifyConfig.info);
            }

            this.goTo("#/landing");
        },

        // Add Resource

        onAdd: function () {
            log.info("Add Resource");

            this.RM.unloadResource();
            this.RM.createResource(this.config)

        },

        // Metadata View

        onMetadata: function () {
            log.info("Metadata View");

            //console.log('metadata!', RM.getMetadata());

            // Init Buttons
            this.switchView(MetadataView, {
                el: this.container,
                menu: "metadata",
                copy: this.config.copyMeta,
                lang: this.lang,
                environment: this.metadataEnvironment,
                config: this.metadataEditorConfig,
                model: this.RM.getMetadata(),
                converters: this.metadataConverters,
                label: this.config.labelMeta,
            });
        },

        // DSD View

        onDSD: function () {

            log.info("DSD View");
            // Check if MD is Enabled

            if (this.RM.MetadataExist()) {

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
                    model: this.RM.getDSD(),
                    isEditable: this.RM.isDSDEditable()
                });
            } else {
                Notify['error'](labels[this.lang]['errorMDisEmpty']);
                this.goTo("#/home");
            }
        },

        // Data View

        onData: function () {
            log.info("Data View");
            // Check if DSD is Enabled
            if(this.RM.DSDExist()) {
                this.switchView(DataView, {
                    el: this.container,
                    menu: "data",
                    config: this.dataEditorConfig,
                    lang: this.lang,
                    codelists: this.RM.getCurrentResourceCodelists(),
                    dsd: this.RM.getDSD(),
                    data: this.RM.getData(),
                    generator: this.RM.generateDSDStructure(),
                    environment: this.environment
                });
            } else {
                Notify['error'](labels[this.lang]['errorDSDisEmpty']);
                this.goTo("#/home");
            }
        },

        // Delete Resource

        onDelete: function () {
            log.info("Delete Resource");
            this.switchView(DeleteView, {
                el: this.container,
                menu: "delete",
                lang: this.lang,
                environment: this.environment,
            });
        },

        onDeleteMetadata: function () {
            log.info("Delete Metadata");
            this.switchView(DeleteView, {
                el: this.container,
                menu: "delete",
                lang: this.lang,
                environment: this.metadataEnvironment,
                deleteMetadata: true
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

            if (typeof candidate.accessControl === "function") {
                log.info("View has access control", this.RM.resource);
                candidate.accessControl(this.RM.resource).then(
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
            this._updatePageTitle();

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

            var stringTitle = "",
                self = this,
                head = "";

            $.each(this.menu.o.conf.items, function(index,object){
                if (object.attrs.id == self.menu.o.active) head = object.label[self.lang.toUpperCase()];
            });

            this.$header.html(head);

            if ($.isPlainObject(this.RM.resource.metadata)) {
                if (this.RM.resource.metadata.title) {
                    log.info(this.RM.resource.metadata.title);
                    stringTitle = ' / ' + (this.RM.resource.metadata.title[this.lang.toUpperCase()] || this.RM.resource.metadata.title['EN']);
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