define(['fenix-ui-datamng'], function(FenixUiDatamng){
  var ViewMetadataView = Backbone.View.extend({
    render: function () {
      $(this.el).html("<h1>Hello world</h1>");
      return this;
    }
  });

  FenixUiDatamng.Views.ViewMetadataView = ViewMetadataView;
  return ViewMetadataView;
});
