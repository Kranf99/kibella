define(function (require) {
  require('plugins/extended_metric_vis/extended_metric_vis.less');
  require('plugins/extended_metric_vis/extended_metric_vis_controller');

  // we need to load the css ourselves

  // we also need to load the controller and used by the template

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(ExtendedMetricVisProvider);

  function ExtendedMetricVisProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    // return the visType object, which kibana will use to display and configure new
    // Vis object of this type.
    return new TemplateVisType({
      name: 'extended_metric',
      title: 'Extended Metric',
      description: 'Based on the core Metric-Plugin but gives you the ability' +
        'to output custom aggregates on metric-results.',
      icon: 'fa-calculator',
      template: require('plugins/extended_metric_vis/extended_metric_vis.html'),
      params: {
        defaults: {
          handleNoResults: true,
          fontSize: 60,
          bgColor: '#ffffff',
          fontColor: '#000000',
          t0BgColor: '#008000', 
          t0FontColor: '#ffffff',
          t1Value: null,
          t1BgColor: '#ffa500', 
          t1FontColor: '#ffffff',
          t2Value: null,
          t2BgColor: '#ff0000', 
          t2FontColor: '#ffffff',
          precision: 2,
          outputs: [
            {
              formula: 'metrics[0].value * metrics[0].value',
              label: 'Count squared',
              enabled: true
            }
          ]
        },
        editor: require('plugins/extended_metric_vis/extended_metric_vis_params.html')
      },
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Metric',
          min: 1,
          defaults: [
            { type: 'count', schema: 'metric' }
          ]
        }
      ])
    });
  }
});

// export the provider so that the visType can be required with Private()
//export default ExtendedMetricVisProvider;
