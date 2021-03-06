/*global define*/

define([
    'chaplin',
    'fx-d-m/config/config',
    'fx-d-m/config/config-default',
    'fx-d-m/config/events',
    'fx-d-m/components/resource-manager',
    'pnotify'
], function (Chaplin, C, DC, Events, ResourceManager, PNotify) {

    'use strict';

    // The application object
    // Choose a meaningful name for your application
    var DataManagement = Chaplin.Application.extend({

        initialize: function () {
            var args = [].slice.call(arguments);
            var lang = C.LANG || DC.LANG;

            //the coordinates (x, y) you want to scroll to on view replacement. Set to false to deactivate it.
            this.initLayout({ scrollTo: false });

            Chaplin.Application.prototype.initialize.apply(this, args);
        },

        // Set your application name here so the document title is set to
        // “Controller title – Site title” (see Layout#adjustTitle)
        title: 'FENIX - Data Management',

        start: function () {

            var args = [].slice.call(arguments);

            this.bindEventListeners();

            // You can fetch some data here and start app
            // (by calling super-method) after that.
            Chaplin.Application.prototype.start.apply(this, args);
        },

        bindEventListeners: function () {

            Chaplin.mediator.subscribe(Events.RESOURCE_STORED, function () {

                var notice = new PNotify({
                    title: 'Resource Stored',
                    text: 'Current resource correctly stored.',
                    type: 'success',
                    buttons: {
                        closer: false,
                        sticker: false
                    }

                });
                notice.get().click(function() {
                    notice.remove();
                });

                Chaplin.utils.redirectTo({ url: 'resume' });
            }, this);


            Chaplin.mediator.subscribe(Events.RESOURCE_ABSENT, function () {
                var notice = new PNotify({
                    title: 'Resource Absent',
                    text: 'Please select a resource.',
                    buttons: {
                        closer: false,
                        sticker: false
                    }
                });

                notice.get().click(function() {
                    notice.remove();
                });

                Chaplin.utils.redirectTo({ url: 'landing' });
            });

            Chaplin.mediator.subscribe(Events.NOT_LOGGED, function () {
                var notice = new PNotify({
                    title: 'Not logged in',
                    text: 'Please log in.',
                    buttons: {
                        closer: false,
                        sticker: false
                    }
                });

                notice.get().click(function() {
                    notice.remove();
                });


                //Chaplin.utils.redirectTo({ changeURL: 'login' });
                window.location.href = C.DATA_MANAGEMENT_NOT_LOGGEDIN_URL || DC.DATA_MANAGEMENT_NOT_LOGGEDIN_URL;
            });

            /*Chaplin.mediator.subscribe(Events.SKIP_LANDING_PAGE, function () {
                Chaplin.utils.redirectTo({ url: 'resume' });
            });*/

            Chaplin.mediator.subscribe(Events.DSD_ABSENT, function () {
                var notice = new PNotify({
                    title: 'DSD Absent',
                    text: 'Please add a DSD.',
                    buttons: {
                        closer: false,
                        sticker: false
                    }
                });

                notice.get().click(function() {
                    notice.remove();
                });


                Chaplin.utils.redirectTo({ url: 'resume' });
            });


            Chaplin.mediator.subscribe(Events.RESOURCE_DELETED, function () {

                var notice = new PNotify({
                    title: 'Resource Deleted',
                    text: 'Resource deleted successfully',
                    type: 'success',
                    buttons: {
                        closer: false,
                        sticker: false
                    }
                });

                notice.get().click(function() {
                    notice.remove();
                });



                Chaplin.utils.redirectTo({ url: 'landing' });
            });
        }

    });

    return DataManagement;
});
