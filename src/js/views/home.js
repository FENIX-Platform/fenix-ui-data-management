define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../../nls/labels',
    "../../html/home.hbs",
    "../../config/errors",
],function($, Backbone,log, Q, MultiLang, Template, ERR){

    "use strict";

    var s = {
        btnMeta : "#btnMeta",
        btnDSD : "#btnDSD",
        btnData : "#btnData"
    };

    var HomeView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();
            if (valid === true) {
                log.info("Rendering View - Home", this);
                this.$container.html(Template);
                this._bindEventListeners();
                return this;
            } else {
                log.error("Impossible to render Home");
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
            $(this.$container.find(s.btnMeta)).on("click",function(){
                Backbone.trigger("button:metadata");
            });
            $(this.$container.find(s.btnDSD)).on("click",function(){
                Backbone.trigger("button:dsd");
            });
            $(this.$container.find(s.btnData)).on("click",function(){
                Backbone.trigger("button:data");
            });

        },

        _removeEventListener: function() {
            $(this.$container.find(s.btnMeta)).off("click");
            $(this.$container.find(s.btnDSD)).off("click");
            $(this.$container.find(s.btnData)).off("click");
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
            this._removeEventListener();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return HomeView;

});