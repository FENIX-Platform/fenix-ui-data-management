define(function(){

    'use strict';

    return {

        RESOURCE_LOAD : "RESOURCE_LOAD",
        RESOURCE_LOADED: "RESOURCE_LOADED",
        RESOURCE_UPDATED: "RESOURCE_UPDATED",
        RESOURCE_UNLOADED: "RESOURCE_UNLOADED",
        RESOURCE_DELETE: "RESOURCE_DELETE",
        RESOURCE_DELETE_UNDO: "RESOURCE_DELETE_UNDO",
        RESOURCE_DELETED: "RESOURCE_DELETED",
        RESOURCE_CREATED: "RESOURCE_CREATED",

        SHOW_METADATA: "SHOW_METADATA",
        SHOW_DSD: "SHOW_DSD",
        SHOW_DATA: "SHOW_DATA",
        SHOW_SEARCH: "SHOW_SEARCH",
        SHOW_ADD: "SHOW_ADD",

        METADATA_CREATE : "METADATA_CREATE",
        METADATA_SAVE : "METADATA_SAVE",
        METADATA_INFO : "METADATA_INFO",

        METADATA_COPY_EMPTY_RESOURCE : "METADATA_COPY_EMPTY_RESOURCE",
        METADATA_COPY_SUCCESS : "METADATA_COPY_SUCCESS",

        DSD_INFO : "METADATA_INFO",
        DSD_SAVE : "DSD_SAVE",
        DSD_COPY_EMPTY_RESOURCE : "DSD_COPY_EMPTY_RESOURCE",
        DSD_COPY_SUCCESS : "DSD_COPY_SUCCESS"

    }
});