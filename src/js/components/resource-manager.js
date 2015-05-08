/*global define, amplify*/
define([
    'chaplin',
    'underscore',
    'fx-d-m/config/events',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'amplify'
], function (Chaplin, _, Events, cfg, cfgDef) {
    'use strict';

    var settings = { DATATYPE_CODE: 'code' }

    function ResourceManager() {
        this.bindEventListeners();
    }

    ResourceManager.prototype.bindEventListeners = function () {
        Chaplin.mediator.subscribe(Events.RESOURCE_SELECT, this.loadResource, this);
    };

    ResourceManager.prototype.loadResource = function (resource, callB) {
        var self = this;
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;
        ajaxGET(addr, params, function (data) {
            self.setCurrentResource(data);
            if (callB) callB();
        })
    };

    ResourceManager.prototype.findResource = function (toPost, callBSuccess, callBComplete) {
        var addr = getResourcesFindAddress(cfg, cfgDef);
        ajaxPOST(addr, toPost, callBSuccess, callBComplete);
    };

    ResourceManager.prototype.closeCurrentResource = function () {
        this.resource = null;
        Chaplin.mediator.publish(Events.RESOURCE_CLOSED);
    };

    ResourceManager.prototype.deleteCurrentResource = function (o) {
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        $.ajax({
            url: addr,
            type: 'DELETE',
            crossDomain: true,
            success: _.bind(function () {
                this.resource = null;
                Chaplin.mediator.publish(Events.RESOURCE_DELETED);

                if (o.success && typeof o.success === 'function') {
                    o.success();
                }

            }, this),
            error: _.bind(function () {
                if (o.error && typeof o.error === 'function') {
                    o.error();
                }
            }, this)
        });
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
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;
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
        var meta = this.resource.metadata;
        if (!meta.dsd)
            throw new Error("DSD to update cannot be null");
        if (!meta.dsd.datasources)
            throw new Error("Datasources cannot be null");
        else if (meta.dsd.datasources.length == 0)
            throw new Error("Datasources cannot be null");
        if (!meta.dsd.contextSystem)
            throw new Error("ContextSystem cannot be null");

        if (meta.dsd && meta.dsd.rid) {
            try {
                var addr = getSaveDSDURL(cfg, cfgDef);
                ajaxPUT(addr, meta.dsd, callB);
            }
            catch (ex) {
                throw new Error("Cannot PUT dsd");
            }
        }
        else {
            var toPatch = { uid: meta.uid };
            if (meta.version)
                toPatch.version = meta.version;
            toPatch.dsd = meta.dsd;
            try {
                var addr = getSaveMetadataURL(cfg, cfgDef);
                ajaxPATCH(addr, toPatch, callB);
            }
            catch (ex) {
                console.log(ex);
                throw new Error("Cannot PATCH dsd");
            }
        }
    };

    ResourceManager.prototype.putData = function (resource, callB) {
        var addr = getSaveDataURL(cfg, cfgDef);
        var toPut = { metadata: { uid: resource.metadata.uid } };
        if (resource.metadata.version)
            toPut.metadata.version = resource.metadata.version;
        toPut.data = resource.data;
        try {
            ajaxPUT(addr, toPut, callB);
        }
        catch (ex) {
            throw new Error("Cannot put data");
        }
    };

    //Load codelists
    ResourceManager.prototype.getCodelistsFromCurrentResource = function (callB) {
        if (!this.hasColumns())
            return null;
        var cols = this.resource.metadata.dsd.columns;
        var toGet = [];
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].dataType.toLowerCase() == settings.DATATYPE_CODE.toLowerCase()) {
                toGet.push({ uid: cols[i].domain.codes[0].idCodeList, version: cols[i].domain.codes[0].version });
            }
        }
        this.getCodelists(toGet, callB);
    }

    ResourceManager.prototype.getCodelists = function (uids, callB) {
        if (!uids || uids.length == 0)
            if (callB) callB(null);
        var calls = [];
        var f = [];
        for (var i = 0; i < uids.length; i++) {
            calls[i] = getDataAndMetaURL(cfg, cfgDef, uids[i].uid, uids[i].version);
            f[i] = $.ajax(calls[i]);
        }
        //Handle errors!
        $.when.apply($, f).done(function () {
            var results = {};
            var id;
            for (var j = 0; j < f.length; j++) {
                if (f.length == 1) {
                    id = getUIDVer(arguments[j])
                    results[id] = arguments[j];
                }
                else {
                    id = getUIDVer(arguments[j][0])
                    results[id] = arguments[j][0];
                }
            }
            if (callB) callB(results);
        });
    }

    function getUIDVer(clResource) {
        if (clResource.metadata.version)
            return clResource.metadata.uid + "|" + clResource.metadata.version;
        return clResource.metadata.uid;
    }
    //END Load codelists

    ResourceManager.prototype.isResourceAvailable = function () {
        if (!this.resource)
            return false;
        if (!this.resource.metadata)
            return false;
        if (!this.resource.metadata.uid)
            return false;
        return true;
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

    function ajaxPOST(url, JSONToPost, callBSuccess, callBComplete) {
        ajaxPUT_PATCH(url, JSONToPost, 'POST', callBSuccess, callBComplete);
    }

    function ajaxPUT(url, JSONToPut, callBSuccess, callBComplete) {
        ajaxPUT_PATCH(url, JSONToPut, 'PUT', callBSuccess, callBComplete);
    }

    function ajaxPATCH(url, JSONToPatch, callBSuccess, callBComplete) {
        ajaxPUT_PATCH(url, JSONToPatch, 'PATCH', callBSuccess, callBComplete);
    }

    function ajaxPUT_PATCH(url, JSONtoSend, method, callBSuccess, callBComplete) {
        $.ajax({
            contentType: "application/json",
            url: url,
            dataType: 'json',
            type: method,
            data: JSON.stringify(JSONtoSend),
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                if (callBSuccess) callBSuccess(data);
            },
            complete: function () {
                if (callBComplete) callBComplete();
            },
            error: function () {
                console.log('Error on ajax ' + method);
            }
        });
    }

    //END AJAX

    //Helpers
    function getBase(cfg, cfgDef) {
        return cfg.SERVICE_BASE_ADDRESS || cfgDef.SERVICE_BASE_ADDRESS;
    }
    function appendUID_Version(addr, uid, version) {
        if (!uid)
            return addr;
        if (version)
            return addr + "/" + uid + "/" + version;
        return addr + "/uid/" + uid;
    }
    function getDataAndMetaURL(cfg, cfgDef, uid, version) {
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var addr = pathConcatenation(getBase(cfg, cfgDef), srvc.service);
        return appendUID_Version(addr, uid, version);
    }
    function getSaveMetadataURL(cfg, cfgDef) {
        var srvc = cfg.SERVICE_SAVE_METADATA || cfgDef.SERVICE_SAVE_METADATA;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service);
    }
    function getSaveDSDURL(cfg, cfgDef) {
        var srvc = cfg.SERVICE_SAVE_DSD || cfgDef.SERVICE_SAVE_DSD;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service);
    }
    function getSaveDataURL(cfg, cfgDef) {
        var srvc = cfg.SERVICE_SAVE_DATA || cfgDef.SERVICE_SAVE_DATA;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service);
    }
    function getResourcesFindAddress(cfg, cfgDef) {
        var srvc = cfg.SERVICE_RESOURCES_FIND || cfgDef.SERVICE_RESOURCES_FIND;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service)
    }



    function pathConcatenation(path1, path2) {
        if (path1.charAt(path1.length - 1) == '/') {
            return path1 + path2;
        }
        return path1 + "/" + path2;
    }
    //END Helpers

    //Singleton
    return new ResourceManager();
});