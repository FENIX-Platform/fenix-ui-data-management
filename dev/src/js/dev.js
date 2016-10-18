define([
    'loglevel',
    'jquery',
    '../../../src/js/index',
    '../config/dsd',
    '../config/fenix_metadata',
    '../config/catalog',

], function (log, $, DataManagement, DSDConf, MDConf, CataConf) {

    'use strict';

    var s = {
            DATA_MNG: "#data-mng"
        },
        cache = false,
        lang = "EN",
        environment = "develop";

    function Dev() {

        console.clear();
        this._importThirdPartyCss();
        // trace silent
        log.setLevel('silent');
        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Test started");
        this._render();

    };

    Dev.prototype._render = function () {

        this.dataMng = new DataManagement({
            environment: environment,
            el: s.DATA_MNG,
            cache: cache,
            lang: lang,
            dsdEditor: DSDConf,
            metadataEditor: MDConf,
            catalog: CataConf
        });

    };

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require("bootstrap-loader");
        //dropdown selector
        require("../../../node_modules/selectize/dist/css/selectize.bootstrap3.css");
        // fenix-ui-filter
        require("../../../node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");
        // fenix-ui-dropdown
        require("../../../node_modules/fenix-ui-dropdown/dist/fenix-ui-dropdown.min.css");

        // bootstrap-table
        require("../../../node_modules/bootstrap-table/dist/bootstrap-table.min.css");


    };

    return new Dev();

});