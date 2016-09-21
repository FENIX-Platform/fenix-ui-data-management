define(['fenix-ui-datamng'], function(FenixUiDatamng){
  var ViewLandingView = Backbone.View.extend({
    render: function () {
      $(this.el).html("<h1>Hello world</h1>");
      return this;
    }
  });

  FenixUiDatamng.Views.ViewLandingView = ViewLandingView;
  return ViewLandingView;
});
