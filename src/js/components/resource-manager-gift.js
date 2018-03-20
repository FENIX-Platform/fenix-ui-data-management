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

    var originalCreationDate;

    "use strict";

    function ResourceManager() {
        log.info("FENIX DM - Resource Manager for GIFT");

        this.resource = {};

        log.info("FENIX DM - Resource Manager completed.");
    }

    ResourceManager.prototype.init = function (opts) {
        log.info("Resource manager config:");
        log.info(opts);

        if (opts.extra) this.extra = opts.extra;

        this.bridge = new Bridge({
            environment: opts.environment,
            cache: opts.cache,
            extra: opts.extra
        });
    };

    ResourceManager.prototype.getEnvironment = function () {
        log.info("FENIX DM - Current Environment: " + this.environment);
        log.info("FENIX DM - Current Bridge Environment: " + this.bridge.environment);
        log.info("FENIX DM - Current DataManagment Environment: " + this.dmEnvironment);
        return this.environment;
    };


    // Validation

    ResourceManager.prototype.isResourceValid = function (Res) {
        return this.isValidMetadata(Res.metadata);
    };


    ResourceManager.prototype.MetadataExist = function () {
        if (this.resource.metadata !== undefined) return true;
        return 0;
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

    // Resource

    ResourceManager.prototype.createResource = function (opts) {

        var body = $.extend(true, {}, this.resource.metadata);

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

            Backbone.trigger(EVT.RESOURCE_CREATED);
            return;
        }

        if (this.extra != undefined) body = $.extend(true, {}, { metadata : body } , this.extra);


        this.bridge.saveMetadata({
            body: body
        }).then(_.bind(function (resource) {
                log.info("Resource crated", resource);
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
            uid: this.resource.metadata.administration.uid
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
            uid: this.resource.metadata.administration.uid
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

        this.bridge.getMetadata({
            uid: resource.model.uid,
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

        //To visualize the title on the page. Current metadata structure save the title in the survey name field
        this.assign(resource, "title", resource.generalInformation.surveyName);
        this.assign(resource, "uid", resource.administration.uid);
        this.assign(resource, "creationDate", resource.administration.creationDate);
        this.assign(resource, "metadataLastUpdate", resource.administration.metadataLastUpdate);
        this.assign(resource, "datasetAvailability", resource.administration.datasetAvailability);

        originalCreationDate = resource.administration.creationDate;

        if(resource.sampledPopulationInfo.groupsSurveyed !== undefined){

            var array = [];
            array = resource.sampledPopulationInfo.groupsSurveyed.map(function (o) {
                var value;
                if(o["PopulationGroupsList"]!== undefined)
                    value = o["PopulationGroupsList"]["EN"];
                return value;
            });
            resource.sampledPopulationInfo.groupsSurveyed = array;
        }

        if(resource.sampledPopulationInfo.purposelyGroups !== undefined){

            var array = [];
            array = resource.sampledPopulationInfo.purposelyGroups.map(function (o) {
                var value;
                if(o["PurposedlyGroupsList"]!== undefined)
                    value = o["PurposedlyGroupsList"]["EN"];
                return value;
            });
            resource.sampledPopulationInfo.purposelyGroups = array;
        }

        if(resource.foodCompositionInfo.macronutrientDetails !== undefined){

            var array = [];
            array = resource.foodCompositionInfo.macronutrientDetails.map(function (o) {
                var value;
                if(o["MacroDietaryComponentsDetailsList"]!== undefined)
                    value = o["MacroDietaryComponentsDetailsList"]["EN"];
                return value;
            });
            resource.foodCompositionInfo.macronutrientDetails = array;
        }

        if(resource.foodCompositionInfo.micronutrientDetails !== undefined){

            var array = [];
            array = resource.foodCompositionInfo.micronutrientDetails.map(function (o) {
                var value;
                if(o["MicroDietaryComponentsDetailsList"]!== undefined)
                    value = o["MicroDietaryComponentsDetailsList"]["EN"];
                return value;
            });
            resource.foodCompositionInfo.micronutrientDetails = array;
        }

        log.info("Load resource success after", resource);

        this.setResource({ metadata: resource });

        Backbone.trigger(EVT.RESOURCE_LOADED);
    };

    ResourceManager.prototype._onLoadResourceError = function (e) {
        log.error("Load resource error", e);
        log.error(e);
        Backbone.trigger("error:showerrormsg", "Connection error");
    };

    // METADATA

    ResourceManager.prototype.getMetadata = function () {
        log.info("Get Metadata", this.resource);
        return this.resource;
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
            body: $.extend(true, {}, this.resource)
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

        console.log(' updating metadata ');

        var metadataEntities = [
                "generalInformation",
                "surveyInformation",
                "samplingInformation",
                "sampledPopulationInfo",
                "dataAnalysisInfo",
                "foodConsumptionInfo",
                "foodCompositionInfo",
                "additionalInfo"
            ],
            fields = [
                "uid",
                "creationDate",
                "datasetAvailability",
                "metadataLastUpdate"
            ];
            // metadata.meMaintenance.seMetadataMaintenance.metadataLastUpdate

        _.each(fields, _.bind(function (f) {

            this.assign(this.resource, "metadata.administration." + f, metadata[f]);
            delete this.resource.metadata[f];
        }, this));

        _.each(metadataEntities, _.bind(function (m) {
            if (metadata[m]) {

                this.assign(this.resource, "metadata." + m, metadata[m]);
            }
        }, this));

        var d = new Date().getTime();

        this.assign(this.resource, "metadata.administration.metadataLastUpdate", d);
        this.assign(this.resource, "metadata.administration.creationDate", originalCreationDate);


        //this.assign(this.resource.metadata, "metadata.meContent.resourceRepresentationType", resourceRepresentationType);

        console.log('correct', JSON.stringify(this.resource));

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