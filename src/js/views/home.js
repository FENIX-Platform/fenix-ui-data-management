define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../components/resource-manager',
    '../../nls/labels',
    "../../html/home.hbs",
],function($, Backbone,log, Q, RM, MultiLang, Template){

    "use strict";

    var HomeView = Backbone.View.extend({

        render: function (o) {
            log.info("DM {HOME} view",o);
            $.extend(true, this, o);
            this.lang = this.lang.toLowerCase();
            this.s = {
                btnMeta : "#btnMeta",
                btnDSD : "#btnDSD",
                btnData : "#btnData"
            };

            log.info("Rendering View - Home");
            this.$el.html(Template);
            this.bindEventListener();
            log.info('And, by the way, this is our object',RM.resource);
            /*
            this.$el.html("<h1>Resource is loaded. Please use the upper menu.</h1><hr>" +
                "<br>And, by the way, this is our object:<hr>Metadata<br><br>" +
                "<code>" + JSON.stringify(RM.resource.metadata) + "</code><hr>DSD<br><br>" +
                "<code>" + JSON.stringify(RM.resource.metadata.dsd) + "</code><hr>DATA<br><br>" +
                "<code>" + JSON.stringify(RM.resource.data) + "</code>"
            );
            */
            return this;
        },

        bindEventListener: function() {
            var self = this;
            $(this.s.btnMeta).on("click",function(){
                self.router.navigate("#/metadata");
            });
            $(this.s.btnDSD).on("click",function(){
                self.router.navigate("#/dsd");
            });
            $(this.s.btnData).on("click",function(){
                self.router.navigate("#/data");
            });

        },

        removeEventListener: function() {
            $(this.s.btnMeta).off("click");
            $(this.s.btnDSD).off("click");
            $(this.s.btnData).off("click");
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
            this.removeEventListener();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return HomeView;

});