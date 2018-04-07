define(function (require) {
  require('plugins/kibana-html-plugin/html.less');
  require('plugins/kibana-html-plugin/htmlController');
  require('ui/registry/vis_types').register(HtmlVisProvider);
  
  function HtmlVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

    return new TemplateVisType({
      name: 'html',
      title: 'Html widget',
      icon: 'fa-code',
      description: 'Useful for displaying html in dashboards.',
      template: require('plugins/kibana-html-plugin/html.html'),
      params: {
        editor: require('plugins/kibana-html-plugin/htmlOptions.html')
      },
      requiresSearch: true
    });
  }

  return HtmlVisProvider;
});
