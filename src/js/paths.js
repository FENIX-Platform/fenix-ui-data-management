/*global  define*/

define(function () {

    'use strict';

    var config = {

            config : {
                SITE_TEMPLATE : 'topmenu'
            },

            // Specify the paths of vendor libraries
            paths: {
                underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                amplify : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
                rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                pnotify: '{FENIX_CDN}/js/pnotify/2.0.1/pnotify.custom.min',

                'fx-d-m/start': './application',
                'fx-d-m/routes': './routes',
                'fx-d-m/components' : './components',
                'fx-d-m/config' : '../../config',
                'fx-d-m/controllers' : './controllers',
                'fx-d-m/lib' : './lib',
                'fx-d-m/models' : './models',
                'fx-d-m/templates' : './templates',
                'fx-d-m/views': './views',
                'fx-d-m/i18n' : '../../i18n',

                'fx-d-m/templates/site' : './templates/site-topmenu.hbs'

            },

            // Underscore and Backbone are not AMD-capable per default,
            // so we need to use the AMD wrapping of RequireJS
            shim: {
                underscore: {
                    exports: '_'
                },
                backbone: {
                    deps: ['underscore', 'jquery'],
                    exports: 'Backbone'
                },
                handlebars: {
                    exports: 'Handlebars'
                },
                amplify: {
                    deps: ['jquery'],
                    exports: 'amplifyjs'
                }
            }
            // For easier development, disable browser caching
            // Of course, this should be removed in a production environment
            //, urlArgs: 'bust=' +  (new Date()).getTime()
        };

    return config;
});