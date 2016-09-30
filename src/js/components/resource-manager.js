define([
    'jquery',
    'underscore',
    'loglevel',
    "q",
    'fenix-ui-bridge',
    'backbone'
],function($, _, log, Q, Bridge, Backbone){

    "use strict";

    function ResourceManager() {
        log.info("FENIX Data Management - Resource Manager");
        this.bridge = new Bridge();
        console.log(this.bridge.environment);
        this.resource = {};

    };

    ResourceManager.prototype.setEnvironment = function (env) {
        log.info("FENIX Data Management - Current Environment: "+ env);
        this.environment = env;
    }

    // Validation

    ResourceManager.prototype.isResourceValid = function(DSDRes) {
        //TODO: Apply some logic here!
        return true
    };

    ResourceManager.prototype.isDSDValid = function(DSDRes) {
        //TODO: Apply some logic here!
        var meta = DSDRes;
        if (!meta.dsd) throw new Error("DSD to update cannot be null");
        if (!meta.dsd.datasources) throw new Error("Datasources cannot be null");
            else if (meta.dsd.datasources.length == 0) throw new Error("Datasources cannot be null");
        if (!meta.dsd.contextSystem) throw new Error("ContextSystem cannot be null");

        return true

    };
    ResourceManager.prototype.isDataValid = function(DSDRes) {
        //TODO: Apply some logic here!
        return true

    };
    ResourceManager.prototype.isMetaValid = function(DSDRes) {
        //TODO: Apply some logic here!
        return true

    };

    // Controls

    ResourceManager.prototype.isDSDEditable = function () {
        return !Boolean(this.resource.metadata.dsd.columns.length);
    };

    // Resource

    ResourceManager.prototype.isResourceAvailable = function() {
        //TODO: Check if resource is valid.
        return $.isEmptyObject(this.resource);
    };

    ResourceManager.prototype.unloadResource = function() {
        this.resource = {};
        Backbone.trigger("resource:unloaded");
    };

    ResourceManager.prototype.updateResource = function() {
        Backbone.trigger("resource:updated");
    }

    ResourceManager.prototype.getCodelist = function(codelistUID) {
        log.info('getCodelist called ', codelistUID);
        return this.bridge.getResource({
                body: [],
                uid: codelistUID
            }).then(
                function(resource) {
                    return resource;
                }
            );
    };


    ResourceManager.prototype.loadResource = function (resource) {
        this.bridge.getResource({
                body: [],
                uid: resource.model.uid,
                params: {dsd: true, full: true}
        }).then(
            _.bind(this._onLoadResourceSuccess, this),
            _.bind(this._onLoadResourceError, this)
        );
    };

    ResourceManager.prototype._onLoadResourceSuccess = function (resource) {
        log.info("Load resource success", resource);
        this.resource = resource;
        log.info("navigate to home");
        Backbone.trigger("resource:loaded");
    };

    ResourceManager.prototype._onLoadResourceError = function (e) {
        log.error("Load resource error", e);
        log.error(e);

    };

    // METADATA

    ResourceManager.prototype.getMetadata = function () {
        this.bridge.getMetadata({
            body: [],
            uid: this.resource.metadata.uid
        }).then(
            _.bind(this._onGetMetadataSuccess, this),
            _.bind(this._onGetMetadataError, this)
        );
    };

    ResourceManager.prototype._onGetMetadataSuccess = function (resource) {
        log.info("_onGetMetadataSuccess");
        log.info(resource);
        return resource;

    };

    ResourceManager.prototype._onGetMetadataError = function (e) {
        log.error("_onGetMetadataError");
        log.error(e);
        return false;
    };

    // DSD

    ResourceManager.prototype.getDSD = function () {
        log.info("getDSD Called.",this.resource.metadata.dsd);
        var obj = this.resource.metadata.dsd.columns;
        return obj
    };

    ResourceManager.prototype.setDSD = function (resource) {
        log.info("setDSD Called.", resource);
        if (isDSDValid(resource)) {
            this.resource.metadata.dsd.columns = resource;
            Backbone.trigger("resource:updated");
        }
    };

    // Data

    ResourceManager.prototype.getData = function () {
        log.info("getData called.",this.resource.data);
        var obj = this.resource.data;
        return obj;
    };

    // Utils

    ResourceManager.prototype.getCurrentResourceCodelists = function() {
        log.info("getCurrentResourceCodelists called.")
        var codelists = [];
        var columns = this.resource.metadata.dsd.columns;
        $.each(columns, function (index, object) {
            if (object.dataType == "code")
                codelists.push(object.domain.codes[0].idCodeList)
        });
        return _.unique(codelists);
    };

    ResourceManager.prototype.generateDSDStructure = function() {
        log.info("generateDSDStructure called.")
        var self = this;
        var codelists = self.getCurrentResourceCodelists();
        var ps = [];

        $.each(codelists, function (index, object) { ps.push(self.getCodelist(object)); } );

        return Q.all(ps).then(function(result){
            var structure = {};
            $.each(result, function (index, object) { structure[object.metadata.uid] = object;  });
            return structure;
        });
    };

    return new ResourceManager();


});