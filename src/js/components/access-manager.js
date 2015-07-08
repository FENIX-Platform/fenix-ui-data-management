/*global define, amplify*/
define([
    'chaplin',
    'underscore',
    'fx-d-m/config/events',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-common/AuthManager',
    'amplify'
], function (Chaplin, _, Events, cfg, cfgDef) {
    'use strict';

    //var settings = { DATATYPE_CODE: 'code' }

    function AccessManager() {
        //this.bindEventListeners();
    }

    AccessManager.prototype.isLogged = function () {
        return this.authManager.isLogged();
    }
    /*
    AccessManager.prototype.bindEventListeners = function () {
        Chaplin.mediator.subscribe(Events.RESOURCE_SELECT, this.loadResource, this);
    };
    */




    //Singleton
    return new AccessManager();
});