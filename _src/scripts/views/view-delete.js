define(['fenix-ui-datamng'], function(FenixUiDatamng){
  var ViewDeleteView = Backbone.View.extend({
    render: function () {
      $(this.el).html("<h1>Hello world</h1>");
      return this;
    }
  });

  FenixUiDatamng.Views.ViewDeleteView = ViewDeleteView;
  return ViewDeleteView;
});
