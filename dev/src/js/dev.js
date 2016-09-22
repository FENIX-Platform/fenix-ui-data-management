define([
    'loglevel',
    'jquery',
    '../../../src/js/index'
], function (log, $, DataManagement) {

    'use strict';

    var s = {
            DATA_MNG: "#data-mng"
        },
        cache = false,
        environment = "develop";

    function Dev() {

        console.clear();

        this._importThirdPartyCss();

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
            cache: cache
        });
    };

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require("bootstrap-loader");

    };

    return new Dev();

});