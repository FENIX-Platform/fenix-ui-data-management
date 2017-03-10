define([
    'jquery',
    'underscore',
    'loglevel',
    "q",
    'fenix-ui-bridge',
    'backbone',
    "../../config/events",
    "../../config/config"
], function ($, _, log, Q, Bridge, Backbone, EVT, C) {

    "use strict";

    function ResourceManager() {
        log.info("FENIX DM - Resource Manager");

        this.resource = {};

        log.info("FENIX DM - Resource Manager completed.");
    }

    ResourceManager.prototype.init = function (opts) {
        log.info("Resource manager config:");
        log.info(opts);

        this.bridge = new Bridge({
            environment: opts.environment,
            cache: opts.cache
        });
    };

    ResourceManager.prototype.getEnvironment = function () {
        log.info("FENIX DM - Current Environment: " + this.environment);
        log.info("FENIX DM - Current Bridge Environment: " + this.bridge.environment);
        return this.environment;
    };


    // Validation

    ResourceManager.prototype.isResourceValid = function (Res) {
        return (
            (this.isValidMetadata(Res.metadata)) &&
            (this.isDSDValid(Res.metadata.dsd)) &&
            (this.isDataValid(Res.data))
        );
    };

    ResourceManager.prototype.isDSDValid = function (DSDRes) {

        if (!DSDRes) {
            Backbone.trigger("error:showerrormsg", "DSD to update cannot be null");
            throw new Error("DSD to update cannot be null");
        }
        if (!DSDRes.datasources) {
            Backbone.trigger("error:showerrormsg", "Datasources cannot be null");
            throw new Error("Datasources cannot be null");
        }
        else if (DSDRes.datasources.length == 0) {
            Backbone.trigger("error:showerrormsg", "Datasources cannot be null");
            throw new Error("Datasources cannot be null");
        }
        if (!DSDRes.contextSystem) {
            Backbone.trigger("error:showerrormsg", "ContextSystem cannot be null");
            throw new Error("ContextSystem cannot be null");
        }

        return true
    };

    ResourceManager.prototype.DSDExist = function () {
        if (this.resource.metadata.dsd.columns !== undefined ) return this.resource.metadata.dsd.columns.length;
        return 0;
    };

    ResourceManager.prototype.dataExist = function () {
        if (this.resource.data !== undefined) return this.resource.data.length;
        return 0;
    };

    ResourceManager.prototype.isDataValid = function (DataRes) {
        //TODO: There's no logic here with the current form of the Data Editor
        return true
    };

    ResourceManager.prototype.isValidMetadata = function (MetaRes) {
        //TODO: There's no logic here with the current form of the MetaData Editor
        return true
    };

    // Controls

    ResourceManager.prototype.isMetadataEmpty = function () {
        if (this.resource.metadata)
            return ((this.resource.metadata.length > 0 ));
            return true;
    };

    ResourceManager.prototype.isDSDEmpty = function () {
        return ((this.resource.metadata.dsd.columns === undefined ));
    };

    ResourceManager.prototype.isDSDEditable = function () {
        if (this.resource.data !== undefined) return false;
        return true;
    };

    // Resource

    ResourceManager.prototype.createResource = function (opts) {

        if (!opts.contextSystem) {
            log.error("Impossible to find context system");
            alert("Impossible to find context system");
            return;
        }

        if (!opts.resourceRepresentationType) {
            log.error("Impossible to find resourceRepresentationType");
            alert("Impossible to find resourceRepresentationType");
            return;
        }

        if (Array.isArray(opts.datasources) && opts.datasources.length === 0) {
            log.error("Data Sources can not be null");
            alert("Data Sources can not be null");
            return;
        }


        if(this.isMetadataEmpty()) {
            this.resource.metadata = {};
            this.resource.metadata.meContent = {};
            this.resource.metadata.dsd = {};
            this.resource.metadata.dsd.contextSystem = opts.contextSystem;
            this.resource.metadata.dsd.datasources = opts.datasources;
            this.resource.metadata.meContent.resourceRepresentationType = opts.resourceRepresentationType;

            Backbone.trigger(EVT.RESOURCE_CREATED);
            return;
        }

        this.bridge.saveMetadata({
            body: $.extend(true, {}, this.resource.metadata),
            dsdRid: this.getNestedProperty("metadata.dsd.rid", this.resource)
        }).then(_.bind(function (resource) {
                log.info("Resource crated", resource);
                this.resource.metadata.uid = resource.uid;
                this.resource.metadata.dsd.rid = resource.dsd.rid;
                //$.extend(true, this.resource.metadata, resource);
                Backbone.trigger(EVT.RESOURCE_UPDATED);
            }, this), function (xhr, textstatus) {
                log.error("Error metadata update");
                log.error(xhr);
                log.error(textstatus);
                Backbone.trigger("error:showerrorsrv", null, xhr);
            }
        );


    };

    ResourceManager.prototype.deleteMetadata = function () {
        this.bridge.deleteMetadata({
            uid: this.resource.metadata.uid,
            version: this.resource.metadata.version
        }).then(
            _.bind(function () {
                this.resource = {};
                Backbone.trigger(EVT.RESOURCE_DELETED);
            }, this),
            _.bind(function () {
                Backbone.trigger("error:showerrorsrv", null);
            }, this)
        );

    };

    ResourceManager.prototype.deleteResource = function () {

        this.bridge.deleteResource({
            uid: this.resource.metadata.uid,
            version: this.resource.metadata.version
        }).then(
            _.bind(function () {
                this.resource = {};
                Backbone.trigger(EVT.RESOURCE_DELETED);
            }, this),
            _.bind(function () {
                Backbone.trigger("error:showerrorsrv", null);
            }, this)
        );

    };

    ResourceManager.prototype.unloadResource = function () {
        log.info("RM - unloadResource");
        this.resource = {};
        Backbone.trigger(EVT.RESOURCE_UNLOADED);
    };

    ResourceManager.prototype.getCodelist = function (codelistUID) {
        log.info('getCodelist called ', codelistUID);
        var requ = {
            uid: codelistUID
        };
        if (codelistUID.indexOf("|") != -1) {
            requ['version'] = codelistUID.substr(codelistUID.indexOf("|") + 1, codelistUID.length);
            requ['uid'] = codelistUID.substr(0, codelistUID.indexOf("|"));
        }
        log.info('>bridge.getResource', requ);
        return this.bridge.getResource(requ).then(
            function (resource) {
                log.info('<bridge.getResource', resource);
                return resource;
            }
        );
    };

    ResourceManager.prototype.loadResource = function (resource) {
        log.info("Load resource");
        log.info(resource);

        this.bridge.getResource({
            uid: resource.model.uid,
            version: resource.model.version,
            params: {dsd: true, full: true, export: true}
        }).then(
            _.bind(this._onLoadResourceSuccess, this, resource),
            _.bind(this._onLoadResourceError, this)
        );
    };

    ResourceManager.prototype._onLoadResourceSuccess = function (catalogModel, resource) {

        log.info("Load resource success", resource);

        if (!resource) {
            log.error("Resource is empty");
            Backbone.trigger("error:showerrormsg", "Resource is empty");
        }

        this.assign(resource, "metadata.uid", this.getNestedProperty("uid", catalogModel.model));
        this.assign(resource, "metadata.version", this.getNestedProperty("version", catalogModel.model));
        this.assign(resource, "metadata.dsd.rid", this.getNestedProperty("dsd.rid", catalogModel.model));
        var updDate = this.getNestedProperty("meMaintenance.seUpdate.updateDate", catalogModel.model);
        this.assign(resource, "metadata.meMaintenance.seUpdate.updateDate", updDate);
        this.assign(resource, "metadata.creationDate", this.getNestedProperty("creationDate", catalogModel.model));

        this.setResource(resource);

        Backbone.trigger(EVT.RESOURCE_LOADED);
    };

    ResourceManager.prototype._onLoadResourceError = function (e) {
        log.error("Load resource error", e);
        log.error(e);
        Backbone.trigger("error:showerrormsg", "Connection error");
    };

    // METADATA

    ResourceManager.prototype.getMetadata = function () {
        log.info("Get Metadata", this.resource.metadata);
        return (this.isValidMetadata(this.resource.metadata)) ? this.resource.metadata : {};
    };

    ResourceManager.prototype._onGetMetadataSuccess = function (resource) {
        log.info("_onGetMetadataSuccess");
        log.info(resource);
    };

    ResourceManager.prototype._onGetMetadataError = function (e) {
        log.error("_onGetMetadataError");
        log.error(e);
        Backbone.trigger("error:showerrormsg", "Connection error");
        return false;
    };

    ResourceManager.prototype.saveMetadata = function () {
        log.info("saveMetadata Called.");

        this.bridge.updateMetadata({
            body: $.extend(true, {}, this.resource.metadata),
            dsdRid: this.getNestedProperty("metadata.dsd.rid", this.resource)
        }).then(
            _.bind(function (data) {
                log.info("Success metadata update");
                log.info(data);
                Backbone.trigger(EVT.RESOURCE_UPDATED);

            }, this),
            _.bind(function (xhr, textstatus) {
                log.error("Error metadata update");
                log.error(xhr);
                log.error(textstatus);
                Backbone.trigger("error:showerrorsrv", null, xhr);
            }, this));
    };

    ResourceManager.prototype.setResource = function (resource) {
        this.resource = resource;
    };

    ResourceManager.prototype.updateMetadata = function (metadata) {

        var metadataEntities = [
                "meIdentification",
                "meDocuments",
                "meInstitutionalMandate",
                "meAccessibility",
                "meContent",
                "meDataQuality",
                "meMaintenance",
                "meReferenceSystem",
                "meResourceStructure",
                "meSpatialRepresentation",
                "meStatisticalProcessing"
            ],
            fields = [
                "language",
                "languageDetails",
                "title",
                "creationDate",
                "characterSet",
                "metadataStandardName",
                "metadataStandardVersion",
                "metadataLanguage",
                "contacts",
                "noDataValue",
                "additions"
            ],
            resourceRepresentationType = this.getNestedProperty("metadata.meContent.resourceRepresentationType", this.resource) || C.config.resourceRepresentationType;
            // metadata.meMaintenance.seMetadataMaintenance.metadataLastUpdate

        _.each(fields, _.bind(function (f) {
            this.assign(this.resource, "metadata." + f, metadata[f]);
        }, this));

        _.each(metadataEntities, _.bind(function (m) {
            if (metadata[m]) {
                this.assign(this.resource, "metadata." + m, metadata[m]);
            }

        }, this));


        //var hammer = + new Date();
        //console.log('It\'s ' + hammer + ' time!' );
        //force resourceRepresentationType
        this.assign(this.resource, "metadata.meContent.resourceRepresentationType", resourceRepresentationType);
        //this.assign(this.resource, "metadata.meMaintenance.seMetadataMaintenance.metadataLastUpdate", hammer);

    };

    // DSD

    ResourceManager.prototype.getDSD = function () {

        return this.resource && this.resource.metadata ? $.extend(true, {}, this.resource.metadata.dsd) : undefined;
    };

    ResourceManager.prototype.updateDsd = function (dsd) {


        var dsdRid = this.getNestedProperty("metadata.dsd.rid", this.resource);

        dsd.rid = dsdRid;

        if (!dsd.rid) {
            log.warn("DSD rid not found");
            log.warn(this.resource);
        }

        this.assign(this.resource, "metadata.dsd", dsd);

    };

    ResourceManager.prototype.saveDsd = function () {

        this.bridge.updateDSD({
            body: this.resource.metadata.dsd
        }).then(
            _.bind(function (data) {
                log.info("Success dsd update");
                log.info(data);

                Backbone.trigger(EVT.RESOURCE_UPDATED);

            }, this),
            _.bind(function (xhr, textstatus) {

                log.error("Error dsd update");
                log.error(xhr);
                log.error(textstatus);

                Backbone.trigger("error:showerrorsrv", null, xhr);

            }, this));
    };

    // Data

    ResourceManager.prototype.getData = function () {
        log.info("getData called.", this.resource.data);
        return this.resource.data;
    };

    ResourceManager.prototype.setDataEmpty = function () {
        log.info("setDataEmpty called.");
        this.resource.data = {};
    };

    ResourceManager.prototype.setData = function (resource) {
        log.info("setData called.", resource);
        if (this.isDataValid(resource)) {
            this.resource.data = resource;
            // Data needs the whole package.
            this.updateData(this.resource.data);
        }
    };

    ResourceManager.prototype.updateData = function (resource) {
        log.info("updateData Called.", resource);

        this.bridge.updateData({
            body: {
                "metadata": {
                    uid: this.resource.metadata.uid
                },
                "data": resource
            }
        }).then(
            _.bind(function (data) {

                log.info("Success data update");
                log.info(data);

                Backbone.trigger(EVT.RESOURCE_UPDATED);

            }, this),
            _.bind(function (xhr, textstatus) {
                log.error("Error data update");
                log.error(xhr);
                log.error(textstatus);
                Backbone.trigger("error:showerrorsrv", null, xhr);
            }, this));

    };

    // Utils

    ResourceManager.prototype.getCurrentResourceCodelists = function () {
        log.info("getCurrentResourceCodelists called.")
        if (this.resource.metadata === undefined) return null;
        if (this.resource.metadata.dsd === undefined) return null;
        if (this.resource.metadata.dsd.columns === undefined) return null;
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

    ResourceManager.prototype.generateDSDStructure = function () {
        log.info("generateDSDStructure called.")
        var self = this;
        var codelists = self.getCurrentResourceCodelists();
        var ps = [];

        $.each(codelists, function (index, object) {
            ps.push(self.getCodelist(object));
        });

        return Q.all(ps).then(function (result) {
            var structure = {};
            $.each(result, function (index, object) {
                if (object.metadata.version) {
                    structure[object.metadata.uid + "|" + object.metadata.version] = object;
                } else {
                    structure[object.metadata.uid] = object;
                }
            });
            return structure;
        });
    };

    //Utils

    ResourceManager.prototype.assign = function (obj, prop, value) {
        if (typeof prop === "string")
            prop = prop.split(".");

        if (prop.length > 1) {
            var e = prop.shift();
            this.assign(obj[e] =
                    Object.prototype.toString.call(obj[e]) === "[object Object]"
                        ? obj[e]
                        : {},
                prop,
                value);
        } else {
            obj[prop[0]] = value;
        }
    };

    ResourceManager.prototype.getNestedProperty = function (path, obj) {

        var obj = $.extend(true, {}, obj),
            arr = path.split(".");

        while (arr.length && (obj = obj[arr.shift()]));

        return obj;

    };

    return new ResourceManager();

});