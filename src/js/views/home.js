define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    '../components/resource-manager',
    '../../nls/labels'
],function($, Backbone,log, Q, RM, MultiLang){

    "use strict";

    var HomeView = Backbone.View.extend({

        render: function (o) {
            log.info("DM {HOME} view",o);
            $.extend(true, this, o);

            this.lang = this.lang.toLowerCase();

            log.info("Rendering View - Home");
            this.$el.html("<h1>Resource is loaded. Please use the upper menu.</h1><hr>" +
                "<br>And, by the way, this is our object:<hr>Metadata<br><br>" +
                "<code>" + JSON.stringify(RM.resource.metadata) + "</code><hr>DSD<br><br>" +
                "<code>" + JSON.stringify(RM.resource.metadata.dsd) + "</code><hr>DATA<br><br>" +
                "<code>" + JSON.stringify(RM.resource.data) + "</code>"
            );

            return this;
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

    return HomeView;

});