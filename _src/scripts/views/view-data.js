define(['fenix-ui-datamng'], function(FenixUiDatamng){
  var ViewDataView = Backbone.View.extend({
    render: function () {
      $(this.el).html("<h1>Hello world</h1>");
      return this;
    }
  });

  FenixUiDatamng.Views.ViewDataView = ViewDataView;
  return ViewDataView;
});
