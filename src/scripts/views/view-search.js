define(['fenix-ui-datamng'], function(FenixUiDatamng){
  var ViewSearchView = Backbone.View.extend({
    render: function () {
      $(this.el).html("<h1>Hello world</h1>");
      return this;
    }
  });

  FenixUiDatamng.Views.ViewSearchView = ViewSearchView;
  return ViewSearchView;
});
