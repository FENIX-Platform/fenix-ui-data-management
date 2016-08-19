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

    //Loads the metadata + dsd part, not used yet and not tested
    ResourceManager.loadMetadata = function (resource, success, err, complete) {
        var addr = getMetadataURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_METADATA || cfgDef.SERVICE_GET_METADATA;
        var params = srvc.queryParams;
        _ajaxGET(addr, params, success, err, complete);
    };
    //Loads the data part, not used yet and not tested
    ResourceManager.loadData = function (resource, success, err, complete) {
        var addr = getDataURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA || cfgDef.SERVICE_GET_DATA;
        var params = srvc.queryParams;
        _ajaxGET(addr, params, success, err, complete);
    };


    //perPage=1;
    ResourceManager.prototype.loadResource = function (resource, success, err, complete, limitData) {
        var me = this;
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;
        //Temporary solution, when services to gather informations on the resource will be available the client can get only the needed pieces
        //I need to download all just to disable the "DSD" and "Data" buttons (no data edit withoud DSD, no DSD edit with data).
        //Fix when services will be available, at the moment to speed up apps that just require metadata call with limit set to 1
        if (limitData) {
            params.perPage = limitData;
        }
        else {
            delete (params.perPage);
        }

        var succ = function (data) {
            if (limitData) {
                me.resource = data;
                //Remove the event and make this library free from events
                Chaplin.mediator.publish(Events.RESOURCE_STORED, data);
            }
            else {
                me.resource = data;
            }
            //self.setCurrentResource(data);
            if (success)
                success(data);
        };
        _ajaxGET(addr, params, succ, err, complete);
    };

    ResourceManager.prototype.loadData = function (resource, success, err, complete) {
        var self = this;
        var addr = getDataAndMetaURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var params = srvc.queryParams;

        var succ = function (data) {
            self.setCurrentResource(data);
            if (success)
                success(data);
        };
        _ajaxGET(addr, params, succ, err, complete);
    };

    ResourceManager.prototype.copyMetaData = function (resource, success, err, complete) {
        var self = this;
        var addr = getMetadataURL(cfg, cfgDef, resource.metadata.uid, resource.metadata.version);
        var srvc = cfg.SERVICE_COPY_METADATA || cfgDef.SERVICE_COPY_METADATA;
        var params = srvc.queryParams;

        var succ = function (data) {
            if (data === undefined) {
                err();
            } else {
                self.resource = data;
                if (success) success(data);
            }
        };

        _ajaxGET(addr, params, succ, err, complete);
    };


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
            //Chaplin.mediator.publish(Events.RESOURCE_DELETED);
            if (success)
                success();
        };

        _ajaxDELETE(addr, succ, err);
    };

    /*ResourceManager.prototype.setCurrentResource = function (resource) {
        this.resource = resource;
        Chaplin.mediator.publish(Events.RESOURCE_STORED, resource);
    };*/

    ResourceManager.prototype.getCurrentResource = function () {
        return this.resource;
    };

    //Meta
    ResourceManager.prototype.saveMeta = function (meta, succ, err, complete) {
        var addr = getSaveMetadataURL(cfg, cfgDef);
        var success = function (response) {
            if (succ) succ(response);
        };
        /*var error = function () {
            if (err) err();
        };*/

        _ajaxPOST(addr, meta, success, complete, err);
    };
    ResourceManager.prototype.updateMeta = function (meta, succ, err, complete) {
        var addr = getSaveMetadataURL(cfg, cfgDef);
        //it is an update, avoid rewriting and deleting fields in dsd by sending only the rid without the other fields or the DSD might be damaged
        if (meta.dsd && meta.dsd.rid) {
            meta.dsd = { rid: meta.dsd.rid };
        }
        var success = function (response) {
            if (succ) succ(response);
        };
        /*var error = function () {
            if (err) err();
        };*/

        _ajaxPUT(addr, meta, success, complete, err)
    };

    //END Meta

    //DSD
    ResourceManager.prototype.loadDSD = function (resource, success, err, complete) {
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
        _ajaxGET(addr, params, succ, err, complete);
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

    ResourceManager.prototype.updateDSD = function (resource, success, err, complete) {
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
            _ajaxPUT(addr, meta.dsd, success, complete, err);
        }
        else {
            var toPatch = { uid: meta.uid };
            if (meta.version)
                toPatch.version = meta.version;
            toPatch.dsd = meta.dsd;

            var addr = getSaveMetadataURL(cfg, cfgDef);
            _ajaxPATCH(addr, toPatch, success, complete, err);
        }
    };
    //End DSD


    //Data
    ResourceManager.prototype.putData = function (resource, success, err) {
        var addr = getSaveDataURL(cfg, cfgDef);
        var toPut = { metadata: { uid: resource.metadata.uid } };
        if (resource.metadata.version)
            toPut.metadata.version = resource.metadata.version;
        toPut.data = resource.data;


        //console.log(JSON.stringify(toPut));
        _ajaxPUT(addr, toPut, success, null, err);
    };
    //END data

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
            //f[i] = $.ajax(calls[i]).done(function () { console.log('done'); }).fail(function () { console.log('fail'); });
            f[i] = $.ajax(calls[i]);
        }
        $.when.apply($, f).done(function () {
            var results = {};
            var id;
            var downloadErr = false;
            var downloadErrUIDs = [];
            for (var j = 0; j < f.length; j++) {
                if (f.length == 1) {
                    if (!arguments[j]) {
                        downloadErrUIDs.push("UID: " + uids[j].uid + " ver:" + uids[j].version);
                        downloadErr = true;
                    }
                    else {
                        id = getUIDVer(arguments[j])
                        results[id] = arguments[j];
                    }
                }
                else {
                    if (!arguments[j][0]) {
                        downloadErrUIDs.push("UID: " + uids[j].uid + " ver:" + uids[j].version);
                        downloadErr = true;
                    }
                    else {
                        id = getUIDVer(arguments[j][0])
                        results[id] = arguments[j][0];
                    }
                }
            }
            if (downloadErr) {
                if (err) err(downloadErrUIDs);
            }
            else {
                if (success) success(results);
            }
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

    ResourceManager.prototype.getTitle = function () {
        var lang = cfg.LANG || cfgDef.LANG;
        if (!this.resource.metadata.title[lang]) return "Missing Title in "+lang;
        return this.resource.metadata.title[lang];
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
    function _ajaxGET(url, queryParam, success, err, complete) {
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
            },
            complete: function () {
                if (complete) complete();
            }
        });
    }

    function _ajaxDELETE(url, success, err, complete) {
        $.ajax({
            url: url,
            type: 'DELETE',
            crossDomain: true,
            //Datatype changed to text as the server returns an empty response, setting it to json would trigger an error on success
            dataType: 'text',
            success: function () {
                if (success)
                    success();
            },
            
            error: function (xhr) {
                if (err)
                    err();
                else
                    console.log('Error on ajax DELETE')
            },
            complete: function () {
                if (complete) complete();
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
    //data and meta load
    function getDataAndMetaURL(cfg, cfgDef, uid, version) {
        var srvc = cfg.SERVICE_GET_DATA_METADATA || cfgDef.SERVICE_GET_DATA_METADATA;
        var addr = pathConcatenation(getBase(cfg, cfgDef), srvc.service);
        return appendUID_Version(addr, uid, version);
    }
    //only data
    function getDataURL(cfg, cfgDef, uid, version) {
        var srvc = cfg.SERVICE_GET_DATA || cfgDef.SERVICE_GET_DATA;
        var addr = pathConcatenation(getBase(cfg, cfgDef), srvc.service);
        return appendUID_Version(addr, uid, version);
    }
    //only metadata
    function getMetadataURL(cfg, cfgDef, uid, version) {
        var srvc = cfg.SERVICE_GET_METADATA || cfgDef.SERVICE_GET_METADATA;
        var addr = pathConcatenation(getBase(cfg, cfgDef), srvc.service);
        return appendUID_Version(addr, uid, version);
    }
    //save metadata
    function getSaveMetadataURL(cfg, cfgDef) {
        var srvc = cfg.SERVICE_SAVE_METADATA || cfgDef.SERVICE_SAVE_METADATA;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service);
    }
    //save dsd
    function getSaveDSDURL(cfg, cfgDef) {
        var srvc = cfg.SERVICE_SAVE_DSD || cfgDef.SERVICE_SAVE_DSD;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service);
    }
    //save data
    function getSaveDataURL(cfg, cfgDef) {
        var srvc = cfg.SERVICE_SAVE_DATA || cfgDef.SERVICE_SAVE_DATA;
        return pathConcatenation(getBase(cfg, cfgDef), srvc.service);
    }
    //resources find
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