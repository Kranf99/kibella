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
        name: 'c3Charts', // Unchanged for not bothering current kibella users
        title: 'Bar & Line',
        icon: 'fa-bar-chart',
        description: 'This is Kibella plugin which uses the JavaScript library Plotly for data representations.',
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
            grouped: false,
            threshold: false,
            threshold_value: 0,

          },
              editor: c3VisParamsTemplate
        },
        schemas: new Schemas([
              {
              group: 'metrics',
                name: 'metric',
                title: 'Y-axis metric',
                min: 1,
                max: 5,
                defaults: [ { type: 'count', schema: 'metric' } ],   	
              },
              {
                  group: 'buckets',
                  name: 'buckets',
                  title: 'X-Axis',
                  min: 1,
                  max: 1,
                  aggFilter: ['!geohash_grid']
              }
        ])
      });
  }

  return c3VisProvider;
});
