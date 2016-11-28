/*global define*/
define(function () {
    'use strict';
    return {
        //Generic
        "confirmDataRemove": "Do you want to remove all your data?",
        "success": "Success",
        "resourceNew":"Resource created",
        "resourceSaved":"Resource saved",
        "resourceDeleted": "Resource deleted",
        "resourceLoaded": "Resource loaded",
        "resourceCopied": "Resource copied",

        "alreadyLoading" : "Please be patient. Resource is loading...",

        // Errors
        "error": "Error",
        "errorMetaMinimum" : "Please fill the minimum set of metadata in the \"Identification\" and \"Contacts\" sections",
        "errorParsingJson": "Error parsing Json file, check the structure and try again",

        "errorLoadinResource": "Error loading the resource",
        "errorSavingResource": "Error saving the resource",

        "overwriteExistingDSD": "This operation will overwrite the DSD you're working on, continue?",
        "unsavedWarning": "Some changes are not saved, do you want to continue without saving?",

        "downloadDSD": "Download DSD",
        "uploadDSD": "Upload DSD",

        //Data Editor
        "invalidData": "Data is not valid",
        "nullDSDCols": "DSD has no columns",
        "nullCsvCols": "CSV has no columns",
        "wrongColumnCount": "The columns' count in the CSV must match the one in the DSD",
        "wrongColumnId": "The columns' names in the CSV must match the IDs in the DSD",
        "unknownCodes": "Some codes could not be found in a codelist",
        "DataMatchColumn": "Match the DSD columns with the CSV ones",
        "DataDuplicateFound" : "Some duplicated values found, keep old data or replace with the new values just uploaded?",
        "btnDataMergeKeepNew" : "Replace with new values",
        "btnDataMergeKeepOld" : "Keep old values",
        "btnDataMergeCancel" : "Cancel",
        "DataEditorMainContainer" : "LOADING...",
        "DataDeleteAll":"Delete all",
        "DatalblUpload":"Upload",
        "DatalblSeparator":"CSV Separator",
        "DatalblcsvSeparatorSemi" : "Semicolon",
        "DatalblcsvSeparatorComma" : "Comma",
        "csvLoaded": "CSV Loaded",


        //DataValidator
        "unknownCode": "Unknown code",
        "invalidYear": "Invalid year",
        "invalidMonth": "Invalid month",
        "invalidDate": "Invalid date",
        "invalidNumber": "Invalid number",
        "invalidBool": "Invalid boolean",

        //Buttons
        "btnSearch" : "SEARCH",
        "btnAdd" : "ADD",
        "btnMetadata" : "METADATA",
        "btnDSD" : "DSD",
        "btnData" : "DATA",
        "btnSaveMeta" : "Save",
        "btnCopyMeta" : "Copy Metadata",
        "btnLoadMeta" : "Load",
        "btnSaveDSD" : "Save",
        "btnClose" : "Close",
        "btnCsvMatcherOk" : "OK",
        "btnCsvMatcherCancel" : "Cancel",
        "btnHome" : "Home",
        "btnDeleteUndo" : "Undo",
        "btnDeleteConfirm" : "Confirm",
        "dataEditEnd" : "Save",
        //2.0
        "btnSave" : "Save",



        //Headers
        "DManHeader": "FENIX Data Management",
        "DManResHeader" : "Edit Resource",
        "MetaHeader" : "Metadata Editor",
        "MetaCopyHeader" : "Copy metadata from",
        "DSDHeader" : "Data Structure Definition Editor",
        "DataHeader" : "Data Editor",
        "CloseHeader" : "Resource Closed",
        "DeleteHeader" : "Delete Resource?",

        //Titles


        //Descriptions
        "DManIntro" : "Data management is the process of controlling the information generated during a research project. Any research will require some level of data management, and funding agencies are increasingly requiring scholars to plan and execute good data management practices.",
        "CopyMetaRID" : "Resource Identification Code",
        "CopyMetaVer" : "Resource Version (if applicable)",
        "NoTitle": "Untitled",
        "CopyDSD" : "Copy DSD from:",

        //metadata validation
        metadataValidationWarning : "Please fill the mandatory fields",

        //DSD
        DSD_COPY_SUCCESS : "DSD copied successfully",
        DSD_COPY_EMPTY_RESOURCE : "Resource does not contains columns",
        DSD_MINIMUM: "At least one column is required to save DSD",

        //Metadata
        METADATA_COPY_EMPTY_RESOURCE : "Resource not found",
        METADATA_COPY_SUCCESS : "Metadata copied successfully",

        //DATA
        CSVSEPARATOR : "Please select a CSV separator"

    }
});
