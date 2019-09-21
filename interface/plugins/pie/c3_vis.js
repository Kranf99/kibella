define(function (require) {
  require('plugins/pie/c3_vis.less');
  require('plugins/pie/c3_vis_controller');
  var TemplateVisTypeTemplateVisTypeProvider = require('ui/template_vis_type/TemplateVisType');
  var VisSchemasProvider = require('ui/Vis/Schemas');
  var c3VisTemplate = require('plugins/pie/c3_vis.html');
  var c3VisParamsTemplate = require('plugins/pie/c3_vis_params.html');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(pieVisProvider);

  function pieVisProvider(Private) {
      var TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
      var Schemas = Private(VisSchemasProvider);
    
      return new TemplateVisType({
        name: 'pie_chart',
        title: 'Plotly Pie',
        icon: 'fa-bar-chart',
        description: 'This is Kibella plugin which uses the JavaScript library Plotly for data representations.',
        template: c3VisTemplate,
        params: {
          defaults: {
            addTooltip: true,
            addLegend: true,
            isDonut: false,
            displayOther: true
          },
          editor: c3VisParamsTemplate
        },
        hierarchicalData: true,
        schemas: new Schemas([
            {
              group: 'metrics',
              name: 'metric',
              title: 'Slice Size',
              min: 1,
              max: 1,
              aggFilter: ['sum', 'count', 'cardinality'],
              defaults: [
                { schema: 'metric', type: 'count' }
              ]
            },
            {
              group: 'buckets',
              name: 'segment',
              icon: 'fa fa-scissors',
              title: 'Split Slices',
              min: 0,
              max: Infinity,
              aggFilter: '!geohash_grid'
            },
            {
              group: 'buckets',
              name: 'split',
              icon: 'fa fa-th',
              title: 'Split Chart',
              mustBeFirst: true,
              min: 0,
              max: 1,
              aggFilter: '!geohash_grid'
            }
        ])
      });
  }

  return pieVisProvider;
});
