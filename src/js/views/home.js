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
            $.extend(true, this, o);

            this.lang = this.lang.toLowerCase();

            console.log(RM.resource)
            log.info("Rendering View - Home");
            this.$el.html("<h1>Hello world from Home</h1><hr>" +
                "<br>And, by the way, this is our object:<br><code>" + JSON.stringify(RM.resource) + "</code><br>" );

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