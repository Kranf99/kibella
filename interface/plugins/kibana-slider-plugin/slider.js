define(function (require) {
  
  require('plugins/kibana-slider-plugin/slider.less');
  require('plugins/kibana-slider-plugin/sliderController');
  require('angularjs-slider/dist/rzslider.css');
  require('angularjs-slider/dist/rzslider.min.js');
  require('ui/registry/vis_types').register(SliderVisProvider);

  function SliderVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

    return new TemplateVisType({
      name: 'slider',
      title: 'Slider',
      icon: 'fa-sliders',
      description: 'Useful for filtering with sliders in dashboards.',
      template: require('plugins/kibana-slider-plugin/slider.html'),
      params: {
        editor: require('plugins/kibana-slider-plugin/sliderOptions.html')
      },
      requiresSearch: true
    });
  }

  return SliderVisProvider;
});
