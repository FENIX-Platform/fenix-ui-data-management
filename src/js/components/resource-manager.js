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

    //When redesigning the new dataManagement use this instead of the old one,
    //the self.setCurrentResource must be called separately
    ResourceManager.prototype.loadResourceNew = function (resource, success, err, noData) {
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;

        var succ = function (data) {
            if (data) {
                if (success)
                    success(data);
            }
            else {
                if (noData) noData();
            }
        }
        _ajaxGET(addr, params, succ, err);
    };

    ResourceManager.prototype.loadResource = function (resource, success, err, noData) {
        var me = this;
        var succ = function (data) {
            me.setCurrentResource(data);
            if (success)
                success();
        }

        this.loadResourceNew(resource, succ, err, noData);
    };
    /*ResourceManager.prototype.loadResource = function (resource, success, err, noData) {
        var self = this;
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;

        var succ = function (data) {

            if (data) {
                self.setCurrentResource(data);
            }
            else {
                if (noData) noData();
            }

            if (success)
                success(data);
            //self.setCurrentResource(data);
            //if (success)
            //    success(data);
        };
        _ajaxGET(addr, params, succ, err);
    };*/

    /*ResourceManager.prototype.findResource = function (toPost, callBSuccess, callBComplete, callB_Err) {
        var addr = getResourcesFindAddress(cfg, cfgDef);
        ajaxPOST(addr, toPost, callBSuccess, callBComplete);
    };*/

    ResourceManager.prototype.closeCurrentResource = function () {
        this.resource = null;
        Chaplin.mediator.publish(Events.RESOURCE_CLOSED);
    };

    ResourceManager.prototype.deleteCurrentResource = function (success, err) {
        var addr = getDataAndMetaURL(cfg, cfgDef, this.resource.metadata.uid, this.resource.metadata.version);
        var me = this;
        var succ = function () {
            me.resource = null;
            Chaplin.mediator.publish(Events.RESOURCE_DELETED);
            if (success)
                success();
        };
        _ajaxDELETE(addr, succ, err);
    };


    ResourceManager.prototype.setCurrentResource = function (resource) {
        this.resource = resource;
        Chaplin.mediator.publish(Events.RESOURCE_STORED, resource)
    };

    ResourceManager.prototype.getCurrentResource = function () {
        return this.resource;
    };

    //Meta
    ResourceManager.prototype.createMeta = function (resource, success, complete, err) {
        var addr = getSaveMetadataURL(cfg, cfgDef);
        if (!resource)
            throw new Error("Nothing to save, resource cannot be null");
        if (!resource.metadata)
            throw new Error("Nothing to save, resource must contain a metdata section");
        if (!resource.metadata.uid)
            throw new Error("Nothing to save, the metadata section must contain a UID");
        if (!resource.metadata.meContent.resourceRepresentationType)
            throw new Error("Nothing to save, the metadata section must contain a meContent.resourceRepresentationType");

        _ajaxPOST(addr, resource.metadata, success, complete, err);

        /*
       "create": {
           "url" : "http://fenix.fao.org/d3s_dev/msd/resources/metadata",
           "type": "post",
           "content": "json",
           "response": {
               "keyFields": [{"meIdentification" : ["uid", "rid", "version"]}]
           }
        },
        "overwrite": {
            "url" : "http://fenix.fao.org/d3s_dev/msd/resources/metadata",
            "type" : "put",
            "content": "json",
            "response": {
                "keyFields": [{"meIdentification" : ["uid", "rid", "version"]}]
            }
        }
}
*/
    };
    ResourceManager.prototype.updateMeta = function (resource, success, complete, err) {
        var addr = getSaveMetadataURL(cfg, cfgDef);
        if (!resource)
            throw new Error("Nothing to save, resource cannot be null");
        if (!resource.metadata)
            throw new Error("Nothing to save, resource must contain a metdata section");
        if (!resource.metadata.uid)
            throw new Error("Nothing to save, the metadata section must contain a UID");
        if (!resource.metadata.meContent.resourceRepresentationType)
            throw new Error("Nothing to save, the metadata section must contain a meContent.resourceRepresentationType");

        var toSend = null;
        if (resource.metadata.dsd.rid) {
            toSend = $.extend(true, {}, resource.metadata);
            toSend.dsd = {};
            toSend.dsd.rid = resource.metadata.dsd.rid;
        }
        else {
            toSend = resource.metadata;
        }
        _ajaxPUT(addr, toSend, success, complete, err);
    };

    //END Meta
    //DSD
    ResourceManager.prototype.loadDSD = function (resource, success, err) {
        var self = this;
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;

        var succ = function (data) {
            var dsd = null;
            if (data && data.metadata && data.metadata.dsd)
                dsd = data.metadata.dsd;
            if (success)
                success(dsd);
        };
        _ajaxGET(addr, params, succ, err);
    };

    ResourceManager.prototype.loadDSDColumns = function (resource, success, err) {
        var succ = function (dsd) {
            var cols = null;
            if (dsd)
                cols = dsd.columns;
            if (success)
                success(cols);
        };

        this.loadDSD(resource, succ, err);
    };

    ResourceManager.prototype.updateDSD = function (resource, success, err) {
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
            var addr = getSaveDSDURL(cfg, cfgDef);
            _ajaxPUT(addr, meta.dsd, success, null, err);
        }
        else {
            var toPatch = { uid: meta.uid };
            if (meta.version)
                toPatch.version = meta.version;
            toPatch.dsd = meta.dsd;

            var addr = getSaveMetadataURL(cfg, cfgDef);
            _ajaxPATCH(addr, toPatch, success, null, err);
        }
    };

    //DSD End

    ResourceManager.prototype.putData = function (resource, success, err) {
        var addr = getSaveDataURL(cfg, cfgDef);
        var toPut = { metadata: { uid: resource.metadata.uid } };
        if (resource.metadata.version)
            toPut.metadata.version = resource.metadata.version;
        toPut.data = resource.data;
        _ajaxPUT(addr, toPut, success, null, err);
    };

    //Load codelists
    ResourceManager.prototype.getCodelistsFromCurrentResource = function (success, err) {
        if (!this.hasColumns())
            return null;
        var cols = this.resource.metadata.dsd.columns;
        var toGet = [];
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].dataType.toLowerCase() == settings.DATATYPE_CODE.toLowerCase()) {
                toGet.push({ uid: cols[i].domain.codes[0].idCodeList, version: cols[i].domain.codes[0].version });
            }
        }
        this.getCodelists(toGet, success, err);
    }

    ResourceManager.prototype.getCodelists = function (uids, success, err) {
        if (!uids || uids.length == 0)
            if (success) success(null);
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
            if (success)
                success(results);
        }).fail(function () { if (err) err(); });
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
    function _ajaxGET(url, queryParam, success, err) {
        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'json',
            data: queryParam,
            success: function (data) {
                if (success)
                    success(data);
            },
            error: function () {
                if (err)
                    err();
                else
                    console.log('Error on ajax GET');
            }
        });
    }

    function _ajaxDELETE(url, success, err) {
        $.ajax({
            url: url,
            type: 'DELETE',
            crossDomain: true,
            success: function (data) {
                if (success)
                    success();
            },
            error: function () {
                if (err)
                    err('Error on ajax DELETE');
                else
                    console.log('Error on ajax DELETE')
            }
        });
    }

    function _ajaxPOST(url, JSONToPost, success, complete, err) {
        _ajaxPUT_PATCH(url, JSONToPost, 'POST', success, complete, err);
    }

    function _ajaxPUT(url, JSONToPut, success, complete, err) {
        _ajaxPUT_PATCH(url, JSONToPut, 'PUT', success, complete, err);
    }

    function _ajaxPATCH(url, JSONToPatch, success, complete, err) {
        _ajaxPUT_PATCH(url, JSONToPatch, 'PATCH', success, complete, err);
    }

    function _ajaxPUT_PATCH(url, JSONtoSend, method, success, complete, err) {
        $.ajax({
            contentType: "application/json",
            url: url,
            dataType: 'json',
            type: method,
            data: JSON.stringify(JSONtoSend),
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                if (success) success(data);
            },
            complete: function () {
                if (complete) complete();
            },
            error: function () {
                if (err) err();
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