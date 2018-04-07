define(function (require) {
  require('plugins/k5p-c3/c3_vis.less');
  require('plugins/k5p-c3/c3_vis_controller');
  var TemplateVisTypeTemplateVisTypeProvider = require('ui/template_vis_type/TemplateVisType');
  var VisSchemasProvider = require('ui/Vis/Schemas');
  var c3VisTemplate = require('plugins/k5p-c3/c3_vis.html');
  var c3VisParamsTemplate = require('plugins/k5p-c3/c3_vis_params.html');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(c3VisProvider);

  // Require the JavaScript CSS file
  require('plugins/k5p-c3/node_modules/c3/c3.css');

  function c3VisProvider(Private) {
      var TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
      var Schemas = Private(VisSchemasProvider);
    
      return new TemplateVisType({
        name: 'c3Charts',
        title: 'C3 charts widget',
        icon: 'fa-spinner',
        description: 'This is Kibella 5 plugin which uses the JavaScript library C3.js for data representations.',
        template: c3VisTemplate,
        params: {
          defaults: {
            type1: 'line',
            color1: '#1f77b4',
            type2: 'line',
            color2: '#ff7f0e',
            type3: 'line',
            color3: '#2ca02c', 
            type4: 'line',
            color4: '#d62728',
            type5: 'line',
            color5: '#9467bd',
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
