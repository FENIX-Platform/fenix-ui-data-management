define([
    "jquery",
    "backbone",
    "loglevel",
    "../../config/errors",
],function($, Backbone, log, ERR){

    "use strict";

    var NotFoundView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, { initial: o });

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - Not Found", this);
                this.$container.html("<h1>Oh snap! Error 404</h1>");
                return this;
            } else {
                log.error("Impossible to render Not Found");
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
            this.lang = this.initial.lang.toLowerCase();

        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    });

    return NotFoundView;

});