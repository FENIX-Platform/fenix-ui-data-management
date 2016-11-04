define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../../nls/labels',
    "../../html/delete.hbs",
    '../components/resource-manager',
    "../../config/errors",
],function($, Backbone, log, Q, MultiLang, Template, RM, ERR){

    "use strict";

    var s = {
        HEADER : "#DeleteHeader",
        BTN_CONFIRM : "#btnDeleteConfirm",
        BTN_UNDO : "#btnDeleteUndo"
    }

    var DeleteView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o})

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - Delete",o);
                this._initViews();
                this._bindEventListeners();
                return this;
            } else {
                log.error("Impossible to render Landing");
                log.error(valid)
            }


        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$container.length === 0) {
                errors.push({code: ERR.MISSING_CONTAINER});
                log.warn("Impossible to find container");
            }

            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {

            this.$container = $(this.initial.container);
            this.cache = this.initial.cache;
            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();

        },

        _initViews: function () {
            this.$container.html(Template);
            $(this.$container.find(s.HEADER)).html(MultiLang[this.lang]['DeleteHeader']);
        },

        _bindEventListeners: function () {
            log.info("{DELETE} bindEventListeners()");
            $(this.$container.find(s.BTN_CONFIRM)).on("click", function(){
                Backbone.trigger("resource:delete");
            });
            $(this.$container.find(s.BTN_UNDO)).on("click", function(){
                Backbone.trigger("button:undo");
            });

        },

        _removeEventListeners: function () {
            $(this.$container.find(s.BTN_CONFIRM)).off("click");
            $(this.$container.find(s.BTN_UNDO)).off("click");
        },

        accessControl: function (Resource) {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(Resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function() {
            this._removeEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DeleteView;

});