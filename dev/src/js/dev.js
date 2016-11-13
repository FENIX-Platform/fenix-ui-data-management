define([
    'loglevel',
    'jquery',
    '../../../src/js/index',
    '../config/dsd',
    '../config/fenix_metadata',
    '../config/catalog'
], function (log, $, DataManagement, DSDConf, MDConf, CataConf) {

    'use strict';

    var s = {
            DATA_MNG: "#data-mng"
        },
        cache = false,
        lang = "EN",
        environment = "develop"; // develop production [demo is not available]

    function Dev() {

        console.clear();

        this._importThirdPartyCss();

        // trace silent

        log.setLevel('silent');

        //log.setLevel('silent');

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
            catalog: CataConf,
            config: {
                contextSystem :"fenix_develop",
                datasources : ["D3S"],
                resourceRepresentationType: "dataset"
            }
        });

    };

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

        //dropdown selector
        require("../../../node_modules/selectize/dist/css/selectize.bootstrap3.css");
        require("../../../node_modules/bootstrap-table/dist/bootstrap-table.min.css");
        //tree selector
        require("../../../node_modules/jstree/dist/themes/default/style.min.css");
        //range selector
        require("../../../node_modules/ion-rangeslider/css/ion.rangeSlider.css");
        require("../../../node_modules/ion-rangeslider/css/ion.rangeSlider.skinHTML5.css");
        //time selector
        require("../../../node_modules/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css");
        // fenix filter
        require("../../../node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");
        require("../../../node_modules/fenix-ui-catalog/dist/fenix-ui-catalog.min.css");
        require("../../../node_modules/fenix-ui-metadata-editor/dist/fenix-ui-metadata-editor.min.css");
        require("../../../node_modules/fenix-ui-dropdown/dist/fenix-ui-dropdown.min.css");
        require("../../../node_modules/fenix-ui-DataEditor/dist/fenix-ui-DataEditor.min.css");
        require("../../../node_modules/fenix-ui-DSDEditor/dist/fenix-ui-DSDEditor.min.css");
        require("../../../node_modules/toastr/build/toastr.min.css");

    };

    return new Dev();

});