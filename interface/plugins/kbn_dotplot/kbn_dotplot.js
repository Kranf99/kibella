define(function (require) {
require('plugins/kbn_dotplot/kbn_dotplot.less');
require('plugins/kbn_dotplot/kbn_dotplot_controller');
require('plugins/kbn_dotplot/kbn_dotplot_params');
require('ui/agg_table');
require('ui/agg_table/agg_table_group');
// var VisVisTypeProvider = require('ui/vis/vis_type');
var TemplateVisTypeProvider = require('ui/template_vis_type/TemplateVisType');
var VisSchemasProvider = require('ui/Vis/Schemas');
var DotplotVisTemplate = require('plugins/kbn_dotplot/kbn_dotplot.html');
var VisTypesRegistryProvider = require('ui/registry/vis_types');
// we need to load the css ourselves

// we also need to load the controller and used by the template

// our params are a bit complex so we will manage them with a directive

// require the directives that we use as well

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(DotplotVisTypeProvider);

// define the DotplotVisType
function DotplotVisTypeProvider(Private) {
  // const VisType = Private(VisVisTypeProvider);
  const TemplateVisType = Private(TemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);

  // define the DotplotVisController which is used in the template
  // by angular's ng-controller directive

  // return the visType object, which kibana will use to display and configure new
  // Vis object of this type.
  return new TemplateVisType({
    name: 'dotplot',
    title: 'Dot plot',
    icon: 'fa-ellipsis-v',
    description: 'Display values in a dot plot',
    // category: VisType.CATEGORY.DATA,
    template: DotplotVisTemplate,
    params: {
      defaults: {
        perPage: 10,
        showPartialRows: false,
        showMeticsAtAllLevels: false,
        sort: {
          columnIndex: null,
          direction: null
        },
        showTotal: false,
        totalFunc: 'sum',
        caseSensitive: true
      },
      editor: '<dotplot-vis-params></dotplot-vis-params>'
    },
    implementsRenderComplete: true,
    hierarchicalData: function (vis) {
      return Boolean(vis.params.showPartialRows || vis.params.showMeticsAtAllLevels);
    },
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'x-axis',
        title: 'X-Axis',
        aggFilter: '!geo_centroid',
        min: 1,
        max: 1
      },
      {
        group: 'metrics',
        name: 'y-axis',
        title: 'Y-Axis',
        aggFilter: '!geo_centroid',
        min: 1,
        max: 1
      },
      {
        group: 'metrics',
        name: 'dotsize',
        title: 'Dot Size',
        aggFilter: '!geo_centroid',
        min: 1,
        max: 1
      },
      {
        group: 'buckets',
        name: 'field',
        title: 'Field',
        max: 2,
        min: 1,
        aggFilter: ['terms']
      }
    ])
  });
}
return DotplotVisTypeProvider;
});

