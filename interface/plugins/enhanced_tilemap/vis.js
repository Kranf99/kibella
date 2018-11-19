'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _supports = require('utils/supports');

var _supports2 = _interopRequireDefault(_supports);

var _push_filter = require('components/filter_bar/push_filter');

var _push_filter2 = _interopRequireDefault(_push_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

define(function (require) {
  require('ui/registry/vis_types').register(EnhancedTileMapVisProvider);
  require('plugins/enhanced_tilemap/vis.less');
  require('plugins/enhanced_tilemap/lib/jquery.minicolors/minicolors');
  require('plugins/enhanced_tilemap/directives/bands');
  require('plugins/enhanced_tilemap/directives/savedSearches');
  require('plugins/enhanced_tilemap/directives/wmsOverlays');
  require('plugins/enhanced_tilemap/visController');

  function EnhancedTileMapVisProvider(Private, getAppState, courier, config) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    var Schemas = Private(require('ui/Vis/Schemas'));

    return new TemplateVisType({
      name: 'enhanced_tilemap',
      title: 'Tile map',
      icon: 'fa-map-marker',
      description: 'Tile map plugin that provides better performance, complete geospatial query support, and more features than the built in Tile map.',
      template: require('plugins/enhanced_tilemap/vis.html'),
      params: {
        defaults: {
          mapType: 'Scaled Circle Markers',
          collarScale: 1.5,
          scaleType: 'Dynamic - Linear',
          scaleBands: [{
            low: 0,
            high: 10,
            color: "#ffffcc"
          }],
          scrollWheelZoom: true,
          isDesaturated: true,
          addTooltip: true,
          heatMaxZoom: 16,
          heatMinOpacity: 0.4,
          heatRadius: 25,
          heatBlur: 15,
          heatNormalizeData: true,
          mapZoom: 2,
          mapCenter: [15, 5],
          markers: [],
          overlays: {
            savedSearches: [],
            wmsOverlays: []
          },
        //  wms: config.get('visualization:tileMap:WMSdefaults')
        },
        mapTypes: ['Scaled Circle Markers', 'Shaded Circle Markers', 'Shaded Geohash Grid', 'Heatmap'],
        scaleTypes: ['Dynamic - Linear', 'Dynamic - Uneven', 'Static'],
        canDesaturate: !!_supports2.default.cssFilters,
        editor: require('plugins/enhanced_tilemap/options.html')
      },
      hierarchicalData: function hierarchicalData(vis) {
        return false;
      },
      schemas: new Schemas([{
        group: 'metrics',
        name: 'metric',
        title: 'Value',
        min: 1,
        max: 1,
        aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality'],
        defaults: [{ schema: 'metric', type: 'count' }]
      }, {
        group: 'buckets',
        name: 'segment',
        title: 'Geo Coordinates',
        aggFilter: 'geohash_grid',
        min: 1,
        max: 1
      }])
    });
  }

  return EnhancedTileMapVisProvider;
});
