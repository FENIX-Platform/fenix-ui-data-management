define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-metadata-editor",
    "../../config/errors",

],function($, Backbone, log, Q, MDE, ERR){

    "use strict";

    var MetadataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});
            console.log(this.initial);

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - Metadata", this);
                this._initViews();
                this._bindEventListeners();
                return this;
            } else {
                log.error("Impossible to render Metadata");
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
            this.model = this.initial.model;
            this.config = this.initial.config;
            this.$savebtn = $(this.initial.savebtn);

        },


        _bindEventListeners: function () {
            var self = this;
            this.$savebtn.on("click", function(){
                Backbone.trigger("meta:saving", self.MDE.getValues());
            });

        },

        _removeEventListeners: function () {
            this.$savebtn.off("click");
        },


        _initViews: function () {
            log.info("{MDE} initViews");
            console.log(this.config)
            this.MDE = new MDE({
                el: this.$container,
                lang: this.lang,
                config: this.config,
                cache : this.cache,
                environment : this.environment,
                model: this.model
            });

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

    return MetadataView;

});