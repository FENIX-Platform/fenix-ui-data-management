define([
    'loglevel',
    'fenix-ui-bridge'
],function(log, Bridge){

    "use strict";

    function ResourceManager() {
        log.info("FENIX Data Management - Resource Manager");
    }

    ResourceManager.prototype.loadResource = function (resource) {

        var bridge = new Bridge();
        var output = bridge.getResource(resource);
        console.log(output);
    };


    return new ResourceManager();


});