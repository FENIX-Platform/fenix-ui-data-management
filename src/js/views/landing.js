define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../../nls/labels',
    "../../html/landing.hbs",
    '../../config/errors',
],function( $, Backbone, log, Q, MultiLang, Template, ERR){

    "use strict";
    var s = {
        btnSearch : "#btnSearch",
        btnAdd : "#btnAdd"
    };

    var LandingView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - Landing", this);
                this.$container.html(Template);
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

        _bindEventListeners: function() {
            $(s.btnSearch).on("click", function() {
                Backbone.trigger("button:search");
            });
            $(s.btnAdd).on("click", function() {
                Backbone.trigger("button:new");
            });
        },

        _removeEventListeners: function() {
            $(s.btnSearch).off("click");
            $(s.btnAdd).off("click");
        },

        accessControl: function (Resource) {
            console.log("landing ac", Resource);
            //TODO: Currently, if a resource is present, stay where you are.
            //TODO: I don't know if this is correct, but I would suggest this kind of approach.
            return new Q.Promise(function (fulfilled) {
                if ($.isEmptyObject(Resource)) fulfilled();
            });
        },


        remove: function() {
            this._removeEventListeners();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return LandingView;

});