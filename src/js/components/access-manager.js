/*global define, amplify*/
define([
    'chaplin',
    'underscore',
    'fx-d-m/config/events',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-common/AuthManager',
    'amplify'
], function (Chaplin, _, E, C, DC, AuthManager) {
    'use strict';

    //var settings = { DATATYPE_CODE: 'code' }

    function AccessManager() {
        this.authManager =  new AuthManager();
        //this.bindEventListeners();
    }

    AccessManager.prototype.isLogged = function () {

        var fakeAuthentication = DC.FAKE_AUTHENTICATION;

        if ( C.FAKE_AUTHENTICATION === false ) {
            fakeAuthentication = C.FAKE_AUTHENTICATION;
        }

        return fakeAuthentication === true ? true : this.authManager.isLogged();
    };

    /*
    AccessManager.prototype.bindEventListeners = function () {
        Chaplin.mediator.subscribe(Events.RESOURCE_SELECT, this.loadResource, this);
    };
    */


    //Singleton
    return new AccessManager();
});