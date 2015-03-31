define(function () {

    'use strict';

    var ServicesCatalog = {
        //SERVICES_BASE_ADDRESS: "http://fenix.fao.org/d3s_dev/msd",
        SERVICES_BASE_ADDRESS: "http://lprapp16.fao.org:7733/v2/msd",

        SERVICE_GET_DATA_METADATA: { service: "resources", queryParams: { full: true, dsd: true } },
        SERVICE_SAVE_METADATA: { service: "resources/metadata" },
        SERVICE_SAVE_DSD: { service: "resources/dsd" },
        SERVICE_SAVE_DATA: { service: "resources" },

        service_getDataAndMetaURL: function (uid, version) {
            var addr = pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_GET_DATA_METADATA.service);
            return this.service_appendUID_Version(addr, uid, version);
            //return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_GET_DATA_METADATA);
        },
        service_saveMetadataURL: function () { return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_SAVE_METADATA.service); },
        service_saveDsdURL: function () { return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_SAVE_DSD.service); },
        service_saveDataURL: function () { return pathConcatenation(this.SERVICES_BASE_ADDRESS, this.SERVICE_SAVE_DATA.service); },

        service_appendUID_Version: function (addr, uid, version) {
            if (!uid)
                return addr;
            if (version)
                return addr + "/" + uid + "/" + version;
            return addr + "/uid/" + uid;
        }
    }

    function pathConcatenation(path1, path2) {
        if (path1.charAt(path1.length - 1) == '/')
            return path1 + path2;
        return path1 + "/" + path2;
    }

    return ServicesCatalog;
});
/*
define(function () {

    'use strict';

    var ServicesCatalog = {
        SERVICE_GET_DATA_METADATA: {
            //method: "get",
            service: "http://fenix.fao.org/d3s_dev/msd/resources",
            //service: "http://faostat3.fao.org/d3s2/v2/msd/resources",
            queryParams: { full: true }
            //contextSystem: "demo1",
            //datasource: "D3S"
        },
        SERVICE_SAVE_METADATA: {
            service: "http://fenix.fao.org/d3s_dev/msd/resources/metadata",
        },
        SERVICE_SAVE_DSD: {
            service: "http://fenix.fao.org/d3s_dev/msd/resources/dsd",
            queryParams: { full: true }
        },
        SERVICE_SAVE_DATA: {
            service: "http://fenix.fao.org/d3s_dev/msd/resources"
        }
    };
    return ServicesCatalog;
});
*/