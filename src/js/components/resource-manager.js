define([
    'jquery',
    'underscore',
    'loglevel',
    "q",
    'fenix-ui-bridge',
    'backbone'
],function($, _, log, Q, Bridge, Backbone){

    "use strict";

    var url = {
        baseUrl: "http://fenix.fao.org/d3s_dev/msd/", // dev as default
        develop: "http://fenix.fao.org/d3s_dev/msd/",
        production: "http://fenixservices.fao.org/d3s/msd/",
        saveMetadata: "resources/metadata",
        saveDSD: "resources/dsd",
        saveData: "resources"
    };

    function ResourceManager() {
        log.info("FENIX DM - Resource Manager");
        this.bridge = new Bridge({
            environment: this.environment
        });
        log.info("FENIX DM - RM : We'll work on '"+this.environment+"' environment.");
        this.resource = {};
        this.url = url;
        log.info("FENIX DM - Resource Manager completed.",this);
    };

    ResourceManager.prototype.setEnvironment = function (env) {
        this.environment = env;
        this.bridge = new Bridge({
            environment: env
        });
        this.url.baseUrl = url[env];
        log.info("FENIX DM - Current Environment: "+ env + " ["+this.url.baseUrl+"]");
    };

    ResourceManager.prototype.getEnvironment = function () {
        log.info("FENIX DM - Current Environment: "+ this.environment);
        log.info("FENIX DM - Current Bridge Environment: "+ this.bridge.environment);
        return this.environment;
    };


    // Validation

    ResourceManager.prototype.isResourceValid = function(Res) {
        //TODO: Apply some logic here!
        return true
    };

    ResourceManager.prototype.isDSDValid = function(DSDRes) {
        //TODO: Apply some logic here! Logic is under, just convert

        if (!DSDRes) throw new Error("DSD to update cannot be null");
        if (!DSDRes.datasources) throw new Error("Datasources cannot be null");
            else if (DSDRes.datasources.length == 0) throw new Error("Datasources cannot be null");
        if (!DSDRes.contextSystem) throw new Error("ContextSystem cannot be null");

        return true

    };

    ResourceManager.prototype.isDataValid = function(DataRes) {
        //TODO: Apply some logic here!
        return true
    };

    ResourceManager.prototype.isMetaValid = function(MetaRes) {
        //TODO: Apply some logic here!
        return true
    };

    // Controls

    ResourceManager.prototype.isDSDEditable = function () {
        return !Boolean(this.resource.metadata.dsd.columns.length);
    };

    // Resource

    ResourceManager.prototype.newResource = function() {
        this.resource = {};
        Backbone.trigger("resource:new");
    };

    ResourceManager.prototype.deleteResource = function() {
        log.info("RM: deleteResource through "+this.url.baseUrl +"resources/uid/" + this.resource.metadata.uid);

        $.ajax({
            url: this.url.baseUrl +"resources/uid/" + this.resource.metadata.uid,
            type: 'DELETE',
            crossDomain: true,
            // Datatype changed to text as the server returns an empty response,
            // setting it to json would trigger an error on success
            dataType: 'text',
            success: function () {
                this.resource = null;
                Backbone.trigger("resource:deleted");
            },
            error: function (xhr, textstatus) {
                Backbone.trigger("error:showerror", null, xhr);
            }
        });

    };


    ResourceManager.prototype.isResourceAvailable = function() {
        //TODO: Check if singolar entity of the resource is valid first.
        return $.isEmptyObject(this.resource);
    };

    ResourceManager.prototype.unloadResource = function() {
        this.resource = {};
        Backbone.trigger("resource:unloaded");
    };

    ResourceManager.prototype.createResource = function(resource, serv) {
        var self = this;
        console.log("I'm trying to upload this: ",JSON.stringify(resource));
        $.ajax({
            contentType: "application/json",
            url: this.url.baseUrl + serv,
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(resource),
            crossDomain: true,
            success: function (data) {
                console.log(data);
                Backbone.trigger("resource:updated");
            },
            error: function (xhr) {
                console.log("Error on createResource", xhr)
            }
        });

    }

    ResourceManager.prototype.updateResource = function(resource, serv) {
        var self = this;
        console.log("I'm trying to upload this: ",JSON.stringify(resource));
            $.ajax({
                contentType: "application/json",
                url: this.url.baseUrl + serv,
                dataType: 'json',
                type: 'PUT',
                data: JSON.stringify(resource),
                crossDomain: true,
                success: function (data) {
                    console.log(data);
                    Backbone.trigger("resource:updated");
                },
                error: function (xhr, textstatus) {
                    console.log("Error on updateResource", xhr, textstatus)
                }
            });

    }

    ResourceManager.prototype.getCodelist = function(codelistUID) {
        log.info('getCodelist called ', codelistUID);
        var requ = {
            body: [],
            uid: codelistUID
        };
        if (codelistUID.indexOf("|") != -1) {
            requ['version'] = codelistUID.substr(codelistUID.indexOf("|")+1, codelistUID.length);
            requ['uid'] = codelistUID.substr(0, codelistUID.indexOf("|"));
        }
        return this.bridge.getResource(requ).then(
                function(resource) {
                    return resource;
                }
            );
    };


    ResourceManager.prototype.loadResource = function (resource) {
        log.info("Load resource", resource);
        log.info("Loading: "+resource.model.uid);
        console.log(this.bridge);
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

    ResourceManager.prototype.getMetadataFromServer = function () {
        this.bridge.getMetadata({
            body: [],
            uid: this.resource.metadata.uid
        }).then(
            _.bind(this._onGetMetadataSuccess, this),
            _.bind(this._onGetMetadataError, this)
        );
    };

    ResourceManager.prototype.getMetadata = function () {
        log.info("getMetadata",this.resource.metadata);
        return (this.isMetaValid(this.resource.metadata)) ? this.resource.metadata : {};
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

    ResourceManager.prototype.setMetadata = function(resource) {
        log.info("setMetadata Called.",resource);
        if (this.isMetaValid(resource)) {
            this.resource.metadata = resource;
            Backbone.trigger("resource:updated");
        }

    };


    // DSD

    ResourceManager.prototype.getDSD = function () {
        log.info("getDSD Called.",this.resource.metadata.dsd);
        return this.resource.metadata.dsd;
    };

    ResourceManager.prototype.setDSD = function (resource) {
        log.info("setDSD Called.", resource);
        if (this.isDSDValid(resource)) {
            this.resource.metadata.dsd = resource;
            this.updateDSD(this.resource.metadata.dsd);
        }
    };

    ResourceManager.prototype.updateDSD = function (resource) {
        log.info("updateDSD called", resource);
        this.updateResource(resource, this.url.saveDSD);
    };

    // Data

    ResourceManager.prototype.getData = function () {
        log.info("getData called.",this.resource.data);
        return this.resource.data;
    };

    ResourceManager.prototype.setData = function (resource) {
        log.info("setData called.",resource);
        if (this.isDataValid(resource)){
            this.resource.data = resource;
            this.updateData(this.resource.data);
        }
    };

    ResourceManager.prototype.updateData = function (resource) {
        log.info("updateData called", resource);
        this.updateResource(resource, this.url.saveData);
    }


    // Utils

    ResourceManager.prototype.getCurrentResourceCodelists = function() {
        log.info("getCurrentResourceCodelists called.")
        var codelists = [];
        var columns = this.resource.metadata.dsd.columns;
        $.each(columns, function (index, object) {
            var output = "";
            if (object.dataType == "code") {
                output = object.domain.codes[0].idCodeList;
                if (object.domain.codes[0].version) output = output + "|" + object.domain.codes[0].version;
                codelists.push(output);
            }
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
            $.each(result, function (index, object) {
                if (object.metadata.version) {
                    structure[object.metadata.uid+"|"+object.metadata.version] = object;
                } else {
                    structure[object.metadata.uid] = object;
                }
            });
            return structure;
        });
    };



    return new ResourceManager();


});