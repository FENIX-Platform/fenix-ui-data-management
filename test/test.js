/*global require*/

var pathProjectRoot = "../../../";
var projectRoot = "./";
var submoduleRoot = '../../submodules/fenix-ui-data-management/';

require.config({
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    },
    paths: {
        compilerPaths: pathProjectRoot + 'submodules/fenix-ui-common/js/Compiler',
        commonPaths: pathProjectRoot + 'submodules/fenix-ui-common/js/paths',
        menuPaths: pathProjectRoot + 'submodules/fenix-ui-menu/js/paths',
        dashboardPaths: pathProjectRoot + 'submodules/fenix-ui-dashboard/src/js/paths',
        chartPaths: pathProjectRoot + 'submodules/fenix-ui-chart-creator/src/js/paths',
        mapPaths: pathProjectRoot + 'submodules/fenix-ui-map-creator/src/js/paths',
        tablePaths: pathProjectRoot + 'submodules/fenix-ui-table-creator/src/js/paths',
        filterPaths: pathProjectRoot + 'submodules/fenix-ui-filter/src/js/paths',
        olapPaths: pathProjectRoot + 'submodules/fenix-ui-olap/js/paths',
        reportPaths: pathProjectRoot + 'submodules/fenix-ui-reports/src/js/paths',
        visualizationPaths : pathProjectRoot + 'submodules/fenix-ui-visualization-box/src/js/paths',
        dataEditorPaths : pathProjectRoot + 'submodules/fenix-ui-DataEditor/js/paths',
        dsdEditorPaths : pathProjectRoot + 'submodules/fenix-ui-DSDEditor/js/paths',
        metadataEditorPaths : pathProjectRoot + 'submodules/fenix-ui-metadata-editor/js/paths',
        catalogPaths : pathProjectRoot + 'submodules/fenix-ui-catalog/js/paths',
        dataManagementPaths : pathProjectRoot + 'submodules/fenix-ui-data-management/src/js/paths',
        dataManagementCommonsPaths : pathProjectRoot + 'submodules/fenix-ui-datamanagement-commons/js/paths',
    }
});

require([
    "compilerPaths",
    "commonPaths",
    "dataEditorPaths",
    "dsdEditorPaths",
    "metadataEditorPaths",
    "catalogPaths",
    "menuPaths",
    "dataManagementPaths",
    "dataManagementCommonsPaths",
], function (Compiler, Commons, DataEditor, DSDEditor, MetadataEditor, Catalog, Menu, DataMng, DataMngCommons) {

    'use strict';

    var submodules_path = projectRoot + '../../submodules/';

    var commonsConfig = Commons;
    commonsConfig.baseUrl = submodules_path + 'fenix-ui-common/js';

    var dataEditorConfig = DataEditor;
    dataEditorConfig.baseUrl =  submodules_path +'fenix-ui-DataEditor/js';

    var dsdEditorConfig = DSDEditor;
    dsdEditorConfig.baseUrl =  submodules_path +'fenix-ui-DSDEditor/js';

    var metadataEditorConfig = MetadataEditor;
    metadataEditorConfig.baseUrl =  submodules_path + 'fenix-ui-metadata-editor/js/';

    var catalogConfig = Catalog;
    catalogConfig.baseUrl =  submodules_path +'fenix-ui-catalog/js/';

    var menuConfig = Menu;
    menuConfig.baseUrl =  submodules_path +'fenix-ui-menu/js';

    var dataMngConfig = DataMng;
    dataMngConfig.baseUrl =  submodules_path +'fenix-ui-data-management/src/js';

    var dataMngCommonsConfig = DataMngCommons;
    dataMngCommonsConfig.baseUrl =  submodules_path +'fenix-ui-datamanagement-commons/js';

    Compiler.resolve([commonsConfig, dataEditorConfig, dsdEditorConfig, metadataEditorConfig, catalogConfig, menuConfig, dataMngConfig, dataMngCommonsConfig],
        {
            placeholders: {"FENIX_CDN": "http://fenixrepo.fao.org/cdn"},

            config: {

                config : {

                    //Set the config for the i18n
                    i18n: {
                        locale: 'en'
                    }
                },

                // The path where your JavaScripts are located
                baseUrl: pathProjectRoot + '/src/js',

                // Specify the paths of vendor libraries
                paths: {

                    //nls: projectRoot + "i18n",
                    //config: projectRoot + "config",
                    //json: projectRoot + "json",

                    test: projectRoot + submoduleRoot + "test",

                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',

                    loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel',

                    //'fx-d-m/templates/site' : pathProjectRoot + "/src/js/templates/site.hbs",
                    //'fx-d-m/config/config' : pathProjectRoot + "/config/submodules/fx-data-mng/Config",
                    //'fx-d-m/i18n/nls/site' : pathProjectRoot + "/i18n/site",
                    //'fx-cat-br/config/config': pathProjectRoot + '/config/submodules/fx-catalog/config',

                    //'fx-menu/config/config': './config/submodules/fx-catalog/config',

                    //'fx-submodules/config/baseConfig': pathProjectRoot + '/config/submodules/config_base'

                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: { },

                //waitSeconds : 15

                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    // Bootstrap the application
    require([
        'loglevel',
        'test/js/test',
        'domReady!'
    ], function (log, Test) {

        //trace, debug, info, warn, error
        log.setLevel('trace');

        log.warn("~~~~~ FENIX Visualization Box: test");
        log.info("===== Start testing:...");

        Test.start();

        log.info("===== End testing");

    });
});