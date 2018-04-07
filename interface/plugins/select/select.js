define(function (require) {

  require('plugins/select/select.less');
  require('plugins/select/select_controller');
  require('ui/registry/vis_types').register(SelectProvider);

  function SelectProvider(Private, courier, $http) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    var fetch = Private(require('components/courier/fetch/fetch'));

    // return the visType object, which kibana will use to display and configure new
    // Vis object of this type.
    return new TemplateVisType({
      name: 'select',
      title: 'Select',
      icon: 'fa-caret-square-o-down',
      description: 'This Visualisation is a Controller that allow you to create filter with the HTML5 Input Select',
      template: require('plugins/select/select.html'),
      params: {
        defaults: {
          field: "country of birth mother",
          size: 5,
          order: "desc",
        },
        editor: require('plugins/select/select_params.html')
      },
      hierarchicalData: false,
      schemas: new Schemas([
         {
          group: 'metrics',
          name: 'metric',
          title: 'Split Size',
          min: 1,
          max: 1,
          defaults: [
            {type: 'count', schema: 'metric'}
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'Split Slices',
          aggFilter: 'terms', // ['count', 'avg', 'sum', 'min', 'max', 'cardinality', 'std_dev']
          min: 1,
          max: 1,
         /* defaults: [
            {type: 'count', schema: 'metric'}
          ]*/
        }
      ])
      
    });
  }

  return SelectProvider;
});