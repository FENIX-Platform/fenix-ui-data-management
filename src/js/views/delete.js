define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../../nls/labels',
    "../../html/delete.hbs",
    "../../config/events"
], function ($, Backbone, log, Q, labels, template, EVT) {

    "use strict";

    var s = {
        HEADER: "#DeleteHeader",
        BTN_CONFIRM: "#btnDeleteConfirm",
        BTN_UNDO: "#btnDeleteUndo"
    };

    var DeleteView = Backbone.View.extend({

        render: function (o) {

            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("Rendering View - Delete", o);

                this._attach();

                this._initVariables();

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

            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {
            this.lang = this.initial.lang.toLowerCase();
        },

        _attach: function () {
            this.$el.html(template({header: labels[this.lang]['DeleteHeader']}));
        },

        _initVariables: function () {

            this.$confirmButton = this.$el.find(s.BTN_CONFIRM);
            this.$undoButton = this.$el.find(s.BTN_UNDO);

        },

        _bindEventListeners: function () {
            log.info("{DELETE} bindEventListeners()");

            this.$confirmButton.on("click", function () {
                Backbone.trigger(EVT.RESOURCE_DELETE);
            });
            this.$undoButton.on("click", function () {
                Backbone.trigger(EVT.RESOURCE_DELETE_UNDO);
            });

        },

        _unbindEventListeners: function () {
            this.$confirmButton.off();
            this.$undoButton.off();
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

        remove: function () {
            this._unbindEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DeleteView;
});