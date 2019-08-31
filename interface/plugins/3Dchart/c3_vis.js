define(function (require) {
  require('plugins/k5p-c3/c3_vis.less');
  require('plugins/k5p-c3/c3_vis_controller');
  var TemplateVisTypeTemplateVisTypeProvider = require('ui/template_vis_type/TemplateVisType');
  var VisSchemasProvider = require('ui/Vis/Schemas');
  var c3VisTemplate = require('plugins/k5p-c3/c3_vis.html');
  var c3VisParamsTemplate = require('plugins/k5p-c3/c3_vis_params.html');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(c3VisProvider);

  function c3VisProvider(Private) {
      var TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
      var Schemas = Private(VisSchemasProvider);
    
      return new TemplateVisType({
        name: '3d_chart', // Unchanged for not bothering current kibella users
        title: '3D Chart',
        icon: 'fa-cube',
        description: 'This is Kibella plugin which uses the JavaScript library Plotly for displaying 3D Charts.',
        template: c3VisTemplate,
        params: {
          defaults: {
            type1: 'bar',
            color1: 'rgb(212, 115, 255)',
            rightY1: false,
            type2: 'bar',
            color2: 'rgb(118, 93, 224)',
            rightY2: false,
            type3: 'bar',
            color3: 'rgb(112, 145, 255)', 
            rightY3: false,
            type4: 'bar',
            color4: 'rgb(142, 216, 243)',
            rightY4: false,
            type5: 'bar',
            color5: 'rgb(188, 82, 188)',
            rightY5: false,
            enableZoom: false,
            dataLabels: false,
            hidePoints: false,
            gridlines: false,
            few_x_axis: false,
            legend_position: "right",
            time_format: "%d-%m-%Y",
            grouped: false

          },
              editor: c3VisParamsTemplate
        },
        schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Metric (Z Dimension)',
        min: 1,
        max: 2,
        aggFilter: ['count', 'sum', 'min', 'max', 'avg'],
        defaults: [
          { type: 'count', schema: 'metric' }
        ]
      },
      {
        group: 'buckets',
        name: 'bucket',
        title: 'X Dimension',
        aggFilter: ['terms',
          'significant_terms',
          'filters',
          'date_range',
          'histogram',
          'date_histogram',
          'range'
        ]
      },
      {
        group: 'buckets',
        name: 'split',
        title: 'Y Dimension',
        aggFilter: ['terms',
          'significant_terms',
          'filters',
          'date_range',
          'histogram',
          'date_histogram',
          'range'
        ]
      }
    ])
      });
  }

  return c3VisProvider;
});
