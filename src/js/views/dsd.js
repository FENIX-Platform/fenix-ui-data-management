define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DSDEditor",
    "../../config/errors",


],function($, Backbone, log, Q, DSD, ERR){

    "use strict";

    var DSDView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - DSD", this);
                this._initViews();
                this._bindEventListeners();
                return this;
            } else {
                log.error("Impossible to render DSD");
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

            //Check if $savebtn is visible
            if (!this.$savebtn.is(":visible")){
                errors.push({code: ERR.MISSING_BUTTONS});
                log.warn("Impossible to find save buttons");
            }


            return errors.length > 0 ? errors : valid;
        },

        _parseInput: function () {

            this.$container = $(this.initial.container);
            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
            this.config = this.initial.config;
            this.$savebtn = $(this.initial.savebtn);
            this.model = this.initial.model;
            this.isEditable = this.initial.isEditable;

        },

        _bindEventListeners: function () {
            log.info("{DSD} bindEventListeners()");
            var self = this;
            this.$savebtn.on("click", function() {
                log.info("{DSD} saving", self.dsd.get());
                Backbone.trigger("dsd:setcolumns", self.dsd.get());
            });

        },

        _initViews: function() {

            log.info("{DSD} initViews");
            var cfg = this.config;
            this.dsd = DSD;

            this.dsd.init(this.$container, cfg, null);
            var col = this.model;
            log.info('{DSD}', col.columns);
            if (col.columns !== undefined && col.columns.length) this.dsd.set(col.columns);
            log.info('{DSD} is editable', this.isEditable);
            this.dsd.editable(this.isEditable);

        },

        _removeEventListeners : function () {
            this.$savebtn.off("click");
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
            log.info("{DSD} remove");
            this._removeEventListeners();
            this.dsd.destroy();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DSDView;

});