define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../../nls/labels',
    "../../html/delete.hbs",
    '../components/resource-manager'
],function($, Backbone, log, Q, MultiLang, Template, RM){

    "use strict";

    var DeleteView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);
            log.info("Rendering View - Delete",o);
            this.lang = this.lang.toLowerCase();
            this.initViews();
            this.bindEventListeners();
            return this;
        },

        initViews: function () {
            this.$el.html(Template);
            $('#DeleteHeader').html(MultiLang[this.lang]['DeleteHeader']);

        },

        bindEventListeners: function () {
            var self = this;
            log.info("{DELETE} bindEventListeners()");
            $('#btnDeleteConfirm').on("click", function(){
                log.info("{DELETE} btnDeleteConfirm");
                RM.deleteResource();
            });
            $('#btnDeleteUndo').on("click", function(){
                log.info("{DELETE} btnDeleteUndo");
                Backbone.Router.navigate("#/landing");
            });

        },

        accessControl: function () {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(RM.resource)) {
                    fulfilled();
                } else {
                    rejected();
                }

            });
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DeleteView;

});