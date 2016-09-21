define(['fenix-ui-datamng'], function(FenixUiDatamng){
  var ViewDsdView = Backbone.View.extend({
    render: function () {
      $(this.el).html("<h1>Hello world</h1>");
      return this;
    }
  });

  FenixUiDatamng.Views.ViewDsdView = ViewDsdView;
  return ViewDsdView;
});
