define([
    'jquery',
    'underscore',
    'loglevel',
    'fenix-ui-bridge',
    'backbone'
],function($, _, log, Bridge, Backbone){

    "use strict";

    function ResourceManager() {
        log.info("FENIX Data Management - Resource Manager");
        this.bridge = new Bridge();
        this.resource = {};
    }

    ResourceManager.prototype.loadResource = function (resource) {

        this.bridge.getResource({
                body: [],
                uid: resource.model.uid
        }).then(
            _.bind(this._onLoadResourceSuccess, this),
            _.bind(this._onLoadResourceError, this)
        );
    };

    ResourceManager.prototype._onLoadResourceSuccess = function (resource) {
        log.info("Load resource success");
        log.info(resource);
        this.resource = resource;
        log.info("navigate to home");
        Backbone.trigger("resource:loaded");

    }

    ResourceManager.prototype._onLoadResourceError = function (e) {
        log.error("Load resource error");
        log.error(e);

    };

    return new ResourceManager();


});