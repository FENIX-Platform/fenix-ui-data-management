define([
  'chaplin',
  'fx-d-m/views/site-view'
], function(Chaplin, SiteView) {

  'use strict';

  var Controller = Chaplin.Controller.extend({

    // Place your application-specific controller features here.
    beforeAction: function() {
      this.reuse('site', SiteView);
    }

  });

  return Controller;
});
