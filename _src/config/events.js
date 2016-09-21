if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function () {

    'use strict';

    var EventsCatalog = {
        RESOURCE_ABSENT: 'fx.resource.absent',
        RESOURCE_CLOSED: 'fx.resource.closed',
        RESOURCE_DELETED: 'fx.resource.deleted',
        RESOURCE_SELECT: 'fx.resource.select',
        RESOURCE_STORED: 'fx.resource.stored',

        NOT_LOGGED: 'fx.auth.notLogged',

        DSD_ABSENT: 'fx.dsd.absent',

        //SKIP_LANDING_PAGE: 'fx.landingPage.skip',
    };

    return EventsCatalog;
});
