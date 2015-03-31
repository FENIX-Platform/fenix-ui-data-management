define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/views/base/view',
    'text!fx-d-m/templates/site.hbs',
    'fx-menu/start',
    'fx-d-m/config/events',
    'fx-d-m/components/resource-manager'
], function (Chaplin, C, DC, View, template, Menu, Events, ResourceManager) {

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

        attach: function () {

            View.prototype.attach.call(this, arguments);
            this.bindEventListeners();

            //Top Menu
            this.topMenu = new Menu(DC.TOP_MENU || C.TOP_MENU);

            //Secondary Menu
            this.secondaryMenu = new Menu({
                container: s.SEC_MENU,
                url: 'config/submodules/fx-menu/data-mng_config.json',
                disable: ['delete', 'close', 'data', 'dsd']
            });
        },

        bindEventListeners: function () {

            Chaplin.mediator.subscribe(Events.RESOURCE_STORED, function () {
                this.secondaryMenu.activate(['delete', 'close']);
                this.updateMenuStatus();
            }, this);

            Chaplin.mediator.subscribe(Events.RESOURCE_CLOSED, function () {
                this.secondaryMenu.disable(['delete', 'close']);
            }, this);

            Chaplin.mediator.subscribe(Events.RESOURCE_DELETED, function () {
                this.secondaryMenu.disable(['delete', 'close']);
            }, this);
        },

        updateMenuStatus: function () {
            if (ResourceManager.isResourceAvailable()) {
                if (ResourceManager.hasData())
                    this.secondaryMenu.disable(['dsd']);
                else
                    this.secondaryMenu.activateItem(['dsd']);
                if (!ResourceManager.hasColumns())
                    this.secondaryMenu.disable(['data']);
                else
                    this.secondaryMenu.activateItem(['data']);
            }
            else {
                this.secondaryMenu.disable(['dsd']);
                this.secondaryMenu.disable(['data']);
            }
        },

        dispose: function () {

            Chaplin.mediator.unsubscribe(Events.RESOURCE_STORED);

            View.prototype.dispose.call(this, arguments);

        }
    });

    return SiteView;
});
