/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/config/events',
    'fx-d-m/views/base/view',
    'fx-d-m/components/resource-manager',
    'text!fx-d-m/templates/site',
    'fx-menu/start',
    'i18n!fx-d-m/i18n/nls/site',
    'fx-common/AuthManager'
], function ($, Chaplin, C, DC, E, View, ResourceManager, template, Menu, i18nLabels, AuthManager) {

    'use strict';

    var s = {
        SEC_MENU: '#data-mng-menu-container'
    };

    var SiteView = View.extend({

        container: 'body',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this.initComponents();

        },

        initComponents : function () {

            var self = this,
                topOpts = C.TOP_MENU || DC.TOP_MENU,
                menuConf = $.extend(true, {}, topOpts, {

                    callback: _.bind(this.onMenuRendered, this)

                }),
                menuConfAuth = _.extend({}, menuConf, {
                    hiddens: ['login']
                }),
                menuConfPub = _.extend({}, menuConf, {
                    hiddens: ['datamng', 'logout']
                });

            this.authManager = new AuthManager({
                onLogin: function () {
                    self.topMenu.refresh(menuConfAuth);
                },
                onLogout: function () {
                    self.topMenu.refresh(menuConfPub);
                    window.location.href = C.DATA_MANAGEMENT_NOT_LOGGEDIN_URL || DC.DATA_MANAGEMENT_NOT_LOGGEDIN_URL;
                }
            });

            //Top Menu
            this.topMenu = new Menu(this.authManager.isLogged() ? menuConfAuth : menuConfPub);

        },

        onMenuRendered: function () {

            $("#menu-toggle").click(function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });

            var secOpts =  C.SECONDARY_MENU || DC.SECONDARY_MENU;

            this.secondaryMenu = new Menu($.extend(true, {}, secOpts, {
                container: s.SEC_MENU
            }));

        },

        bindEventListeners: function () {

            Chaplin.mediator.subscribe(E.RESOURCE_STORED, function () {
                this.secondaryMenu.activate(['delete', 'close']);
                this.secondaryMenu.disable(['add']);
                this.updateMenuStatus();
            }, this);

            Chaplin.mediator.subscribe(E.RESOURCE_CLOSED, function () {
                this.secondaryMenu.disable(['delete', 'close']);
                this.secondaryMenu.activate(['add']);
            }, this);

            Chaplin.mediator.subscribe(E.RESOURCE_DELETED, function () {
                this.secondaryMenu.disable(['delete', 'close']);
                this.secondaryMenu.activate(['add']);
            }, this);
        },

        updateMenuStatus: function () {
            if (ResourceManager.isResourceAvailable()) {
                if (ResourceManager.hasData())
                    this.secondaryMenu.disable(['dsd']);
                else
                    this.secondaryMenu.activate(['dsd']);
                if (!ResourceManager.hasColumns())
                    this.secondaryMenu.disable(['data']);
                else
                    this.secondaryMenu.activate(['data']);
            }
            else {
                this.secondaryMenu.disable(['dsd']);
                this.secondaryMenu.disable(['data']);
            }
        },

        dispose: function () {

            Chaplin.mediator.unsubscribe(E.RESOURCE_STORED);

            View.prototype.dispose.call(this, arguments);

        }
    });

    return SiteView;
});
