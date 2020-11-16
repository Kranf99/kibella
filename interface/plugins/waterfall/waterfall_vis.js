define(function (require) {
  require('plugins/waterfall/waterfall_vis.less');
  require('plugins/waterfall/waterfall_vis_controller');
  var TemplateVisTypeTemplateVisTypeProvider = require('ui/template_vis_type/TemplateVisType');
  var VisSchemasProvider = require('ui/Vis/Schemas');
  var waterfallVisTemplate = require('plugins/waterfall/waterfall_vis.html');
  var waterfallVisParamsTemplate = require('plugins/waterfall/waterfall_vis_params.html');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(WaterfallVisProvider);

  function WaterfallVisProvider(Private) {
      var TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
      var Schemas = Private(VisSchemasProvider);
    
      return new TemplateVisType({
        name: 'Waterfall',
        title: 'Waterfall',
        icon: 'fa-align-left',
        description: 'A waterfall chart is a form of data visualization useful to understand sequential and cumulative values.',
        template: waterfallVisTemplate,
        params: {
          defaults: {
            vertical: false,
            gridlines: false,
            legend_position: "right",
            time_format: "%d-%m-%Y",
            threshold: false,
            threshold_value: 0,
            lists: false,
            totals: false,
            update: 0,
            colors: {
              positive: '#3d9970',
              negative: '#ff4136',
              absolute: '#4499ff'
            }
          },
          editor: waterfallVisParamsTemplate
        },
        schemas: new Schemas([
              {
              group: 'metrics',
                name: 'metric',
                title: 'Y-axis metric',
                min: 1,
                max: 1,
                aggFilter: ['sum', 'count'],
                defaults: [ { type: 'count', schema: 'metric' } ],   	
              },
              {
                group: 'buckets',
                name: 'buckets',
                title: 'X-Axis',
                min: 1,
                max: 4,
                aggFilter: ['!geohash_grid']
              }
        ])
      });
  }

  return WaterfallVisProvider;
});
