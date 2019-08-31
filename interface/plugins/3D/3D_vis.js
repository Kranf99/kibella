define(function (require) {
 // require('plugins/k5p-c3/c3_vis.less');
  require('plugins/3D/3D_vis_controller');
  var TemplateVisTypeTemplateVisTypeProvider = require('ui/template_vis_type/TemplateVisType');
  var VisSchemasProvider = require('ui/Vis/Schemas');
  var 3DVisTemplate = require('plugins/3D/3D_vis.html');
  //var 3DVisParamsTemplate = require('plugins/k5p-c3/c3_vis_params.html');
  var c3VisParamsTemplate = require('plugins/k5p-c3/c3_vis_params.html');

  // register the provider with the visTypes registry
  require('ui/registry/vis_types').register(3DVisProvider);

  function 3DVisProvider(Private) {
      var TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
      var Schemas = Private(VisSchemasProvider);
    
      return new TemplateVisType({
        name: '3D',
        title: '3D Chart',
        icon: 'fa-bar-chart',
        description: 'This is Kibella plugin which uses the JavaScript library Plotly for data representations.',
        template: 3DVisTemplate,
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
                title: 'Z-axis metric',
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
              },
              {
                  group: 'buckets',
                  name: 'buckets',
                  title: 'Y-Axis',
                  min: 1,
                  max: 1,
                  aggFilter: ['!geohash_grid']
              }
        ])
      });
  }

  return 3DVisProvider;
});