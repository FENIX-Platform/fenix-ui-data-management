define([
    "jquery",
    "backbone",
    "loglevel"
], function ($, Backbone, log) {

    "use strict";

    var NotFoundView = Backbone.View.extend({

        render: function (o) {

            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("Rendering View - Not Found", this);

                this._attach();
                return this;
            } else {
                log.error("Impossible to render Not Found");
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
            this.$el.html("<h1>Oh snap! Error 404</h1>");
        },

        remove: function () {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return NotFoundView;

});