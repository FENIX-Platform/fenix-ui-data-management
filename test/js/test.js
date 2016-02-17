define([
    'loglevel',
    'fx-d-m/start',
    'fx-d-m/routes'
],function (log, Application, routes){

    'use strict';

    function Test(){

    }

    Test.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Test.prototype._render = function () {

        var app = new Application({
            routes: routes,
            controllerSuffix: '-controller',
            controllerPath: '../../../submodules/fenix-ui-data-management/src/js/controllers/',
            root: '/test/',
            pushState: false
        });

    };

    return new Test();

});