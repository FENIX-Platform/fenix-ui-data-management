/*global define, amplify*/

define([
    'chaplin',
    'fx-d-m/config/events',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/config/services',
    'fx-d-m/config/services-default',
    'amplify'
], function (Chaplin, Events, C, DC, Services, ServicesDefault) {
    'use strict';

    function ResourceManager() {
        this.bindEventListeners();
    }

    ResourceManager.prototype.bindEventListeners = function () {
        Chaplin.mediator.subscribe(Events.RESOURCE_SELECT, this.loadResource, this);
    };

    ResourceManager.prototype.loadResource = function (resource, callB) {
        var self = this;
        var addr = Services.service_getDataAndMetaURL(resource.metadata.uid, resource.metadata.version);
        var params = Services.SERVICE_GET_DATA_METADATA.queryParams;
        ajaxGET(addr, params, function (data) {
            self.setCurrentResource(data);
            if (callB) callB();
        })
    };

    ResourceManager.prototype.closeCurrentResource = function () {
        this.resource = null;
        Chaplin.mediator.publish(Events.RESOURCE_CLOSED);
    };

    ResourceManager.prototype.deleteCurrentResource = function (o) {
        this.resource = null;
        Chaplin.mediator.publish(Events.RESOURCE_DELETED);
        console.warn("WARNING: delete method not implemented yet");
        o.success();

    };


    ResourceManager.prototype.setCurrentResource = function (resource) {
        this.resource = resource;
        Chaplin.mediator.publish(Events.RESOURCE_STORED, resource)
    };

    ResourceManager.prototype.getCurrentResource = function () {
        return this.resource;
    };


    ResourceManager.prototype.loadDSD = function (resource, callB) {
        var self = this;
        var addr = Services.service_getDataAndMetaURL(resource.metadata.uid, resource.metadata.version);
        var params = Services.SERVICE_GET_DATA_METADATA.queryParams;
        ajaxGET(addr, params, function (data) {
            var dsd = null;
            if (data && data.metadata && data.metadata.dsd)
                dsd = data.metadata.dsd;
            if (callB) callB(dsd);
        })
    };
    ResourceManager.prototype.loadDSDColumns = function (resource, callB) {
        this.loadDSD(resource, function (dsd) {
            if (dsd == null) {
                if (callB) callB(null);
                return;
            }
            if (callB)
                callB(dsd.columns);
        });
    };


    ResourceManager.prototype.updateDSD = function (resource, callB) {

        if (!resource.metadata.dsd)  {
            throw new Error("DSD to update cannot be null");
        }

        if (!DC.DSD_EDITOR_DATASOURCE && !C.DSD_EDITOR_DATASOURCE) {
            throw new Error("Datasource cannot be null");
        }

        if (!DC.DSD_EDITOR_CONTEXT_SYSTEM && !C.DSD_EDITOR_CONTEXT_SYSTEM)
            throw new Error("ContextSystem cannot be null");

        var meta = this.resource.metadata;
        //ToDo move this?
        meta.dsd.datasource = C.DSD_EDITOR_DATASOURCE|| DC.DSD_EDITOR_DATASOURCE;
        meta.dsd.contextSystem = C.DSD_EDITOR_CONTEXT_SYSTEM || DC.DSD_EDITOR_CONTEXT_SYSTEM;

        if (meta.dsd && meta.dsd.rid) {
            try {
                var addr = Services.service_saveDsdURL();
                ajaxPUT(addr, meta.dsd, callB);
            }
            catch (ex) {
                throw new Error("Cannot PUT dsd");
            }
        }
        else {
            var toPatch = {uid: meta.uid};
            if (meta.version)
                toPatch.version = meta.version;
            toPatch.dsd = meta.dsd;
            try {
                var addr = Services.service_saveMetadataURL();
                ajaxPATCH(addr, toPatch, callB);
            }
            catch (ex) {
                console.log(ex);
                throw new Error("Cannot PATCH dsd");
            }
        }
    };

    ResourceManager.prototype.putData = function (resource, callB) {
        var url = Services.service_saveDataURL();
        var toPut = {metadata: {uid: resource.metadata.uid}};
        if (resource.metadata.version)
            toPut.metadata.version = resource.metadata.version;
        toPut.data = resource.data;

        try {
            ajaxPUT(url, toPut, callB);
        }
        catch (ex) {
            throw new Error("Cannot put data");
        }
    };

    ResourceManager.prototype.isResourceAvailable = function () {
        var available = false;
        if (this.resource && this.resource.hasOwnProperty("metadata") && this.resource.metadata.hasOwnProperty("uid"))
            available = true;
        return available;
    }

    ResourceManager.prototype.hasData = function () {
        if (!this.isResourceAvailable())
            return false;

        if (this.resource.data && this.resource.data.length > 0) {
            return true;
        }
        return false;
    }
    ResourceManager.prototype.hasColumns = function () {
        if (!this.isResourceAvailable())
            return false;
        if (!this.resource.metadata.dsd)
            return false;
        if (!this.resource.metadata.dsd.columns)
            return false;
        return true;
    }


    //AJAX
    function ajaxGET(url, queryParam, callB) {
        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'json',
            data: queryParam,
            success: function (data) {
                if (callB) callB(data);
            },
            error: function () {
                console.log('Error on ajax GET')
            }
        });
    }

    function ajaxPOST(url, JSONToPost, callB) {
        ajaxPUT_PATCH(url, JSONToPost, 'POST', callB);
    }

    function ajaxPUT(url, JSONToPut, callB) {
        ajaxPUT_PATCH(url, JSONToPut, 'PUT', callB);
    }

    function ajaxPATCH(url, JSONToPatch, callB) {
        ajaxPUT_PATCH(url, JSONToPatch, 'PATCH', callB);
    }

    function ajaxPUT_PATCH(url, JSONtoSend, method, callB) {
        $.ajax({
            contentType: "application/json",
            url: url,
            dataType: 'json',
            type: method,
            data: JSON.stringify(JSONtoSend),
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                if (callB) callB(data);
            },
            error: function () {
                console.log('Error on ajax ' + method);
            }
        });
    }

    //END AJAX

    //Singleton
    return new ResourceManager();
});