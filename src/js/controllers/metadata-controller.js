define([
    'fx-d-m/controllers/base/controller',
    'fx-d-m/views/metadata-view'
], function (Controller, MetadataView) {

    'use strict';

    var MetadataController = Controller.extend({

        show: function (params, route, options) {

            this.view = new MetadataView({
                model: this.model,
                region: 'main',
                query: options.query
            });

        }
    });

    return MetadataController;

});
