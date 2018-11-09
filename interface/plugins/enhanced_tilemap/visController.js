'use strict';

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _geo_json = require('components/agg_response/geo_json/geo_json');

var _geo_json2 = _interopRequireDefault(_geo_json);

var _map = require('plugins/enhanced_tilemap/vislib/_map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

define(function (require) {
  var module = require('ui/modules').get('kibana/tilemap', ['kibana']);

  module.controller('KbnEnhancedTilemapVisController', function ($scope, $rootScope, $element, Private, courier, config, getAppState) {
    var aggResponse = Private(require('components/agg_response/index'));
    var queryFilter = Private(require('components/filter_bar/query_filter'));
    var callbacks = Private(require('plugins/enhanced_tilemap/callbacks'));
    var geoFilter = Private(require('plugins/enhanced_tilemap/vislib/geoFilter'));
    var POIsProvider = Private(require('plugins/enhanced_tilemap/POIs'));
    var utils = require('plugins/enhanced_tilemap/utils');
    var TileMapMap = Private(_map2.default);
    var geoJsonConverter = Private(_geo_json2.default);
    var Binder = require('utils/binder');
    var ResizeChecker = Private(require('components/vislib/lib/resize_checker'));
    var map = null;
    var collar = null;
    appendMap();
    modifyToDsl();

    var shapeFields = $scope.vis.indexPattern.fields.filter(function (field) {
      return field.type === 'geo_shape';
    }).map(function (field) {
      return field.name;
    });
    //Using $root as mechanism to pass data to vis-editor-vis-options scope
    $scope.$root.etm = {
      shapeFields: shapeFields
    };

    var binder = new Binder.default();
    var resizeChecker = new ResizeChecker($element);
    binder.on(resizeChecker, 'resize', function () {
      resizeArea();
    });

    function modifyToDsl() {
      // $scope.vis.aggs.origToDsl = $scope.vis.aggs.toDsl;
      // $scope.vis.aggs.toDsl = function () {
      //   resizeArea();
      //   var dsl = $scope.vis.aggs.origToDsl();
      //   //append map collar filter to geohash_grid aggregation
      //   _lodash2.default.keys(dsl).forEach(function (key) {
      //     if (_lodash2.default.has(dsl[key], "geohash_grid")) {
      //       var origAgg = dsl[key];
      //       origAgg.geohash_grid.precision = utils.getPrecision(map.mapZoom(), config.get('visualization:tileMap:maxPrecision'));
      //       dsl[key] = {
      //         filter: aggFilter(origAgg.geohash_grid.field),
      //         aggs: {
      //           filtered_geohash: origAgg
      //         }
      //       };
      //     }
      //   });
      //   return dsl;
      // };
    }

    function aggFilter(field) {
      collar = utils.scaleBounds(map.mapBounds(), $scope.vis.params.collarScale);
      var filter = { geo_bounding_box: {} };
      filter.geo_bounding_box[field] = collar;
      return filter;
    }

    //Useful bits of ui/public/vislib_vis_type/buildChartData.js
    function buildChartData(resp) {
      var aggs = resp.aggregations;
      var numGeoBuckets = aggs[2].buckets.length;
			// var numGeoBuckets = 0;
      // _lodash2.default.keys(aggs).forEach(function (key) {
      //   if (_lodash2.default.has(aggs[key], "filtered_geohash")) {
      //     aggs[key].buckets = aggs[key].filtered_geohash.buckets;
      //     delete aggs[key].filtered_geohash;
      //     numGeoBuckets = aggs[key].buckets.length;
      //   }
      // });
      console.log("geogrids: " + numGeoBuckets);
      if (numGeoBuckets === 0) return;
      var tableGroup = aggResponse.tabify($scope.vis, resp, {
        canSplit: true,
        asAggConfigResults: true
      });
      var tables = tableGroup.tables;
      var firstChild = tables[0];
      return geoJsonConverter($scope.vis, firstChild);
    }

    function getGeoExtents(visData) {
      return {
        min: visData.geoJson.properties.min,
        max: visData.geoJson.properties.max
      };
    }

    function initPOILayer(layerParams) {
      var layer = new POIsProvider(layerParams);
      var options = {
        color: _lodash2.default.get(layerParams, 'color', '#008800'),
        size: _lodash2.default.get(layerParams, 'markerSize', 'm')
      };
      layer.getLayer(options, function (layer) {
        map.addPOILayer(layerParams.savedSearchId, layer);
      });
    }

    $scope.$watch('vis.params', function (visParams) {
      map.saturateTiles(visParams.isDesaturated);
      map.clearPOILayers();
      $scope.vis.params.overlays.savedSearches.forEach(function (layerParams) {
        initPOILayer(layerParams);
      });
    });

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        /*
         * 'apply changes' creates new vis.aggs object
         * Modify toDsl function and refetch data.
         */
        // if (!_lodash2.default.has($scope.vis.aggs, "origToDsl")) {
        //   modifyToDsl();
        //   courier.fetch();
        //   return;
        // }
        
        var chartData = buildChartData(resp);
        if (!chartData) return;
        var geoMinMax = getGeoExtents(chartData);
        chartData.geoJson.properties.allmin = geoMinMax.min;
        chartData.geoJson.properties.allmax = geoMinMax.max;

        //add overlay layer to provide visibility of filtered area
        var fieldName = getGeoField();
        if (fieldName) {
          map.addFilters(geoFilter.getGeoFilters(fieldName));
        }

        drawWmsOverlays();
        map.addMarkers(chartData, $scope.vis.params, Private(require('components/agg_response/geo_json/_tooltip_formatter')), _lodash2.default.get(chartData, 'valueFormatter', _lodash2.default.identity), collar);

        _lodash2.default.filter($scope.vis.params.overlays.savedSearches, function (layerParams) {
          return layerParams.syncFilters;
        }).forEach(function (layerParams) {
          initPOILayer(layerParams);
        });
      }
    });

    $scope.$on("$destroy", function () {
      binder.destroy();
      resizeChecker.destroy();
      if (map) map.destroy();
    });

    /**
     * Field used for Geospatial filtering can be set in multiple places
     * 1) field specified by geohash_grid aggregation
     * 2) field specified under options in event no aggregation is used
     *
     * Use this method to locate the field
     */
    function getGeoField() {
      var fieldName = null;
      if ($scope.vis.params.filterByShape && $scope.vis.params.shapeField) {
        fieldName = $scope.vis.params.shapeField;
      } else {
        var agg = utils.getAggConfig($scope.vis.aggs, 'segment');
        if (agg) {
          fieldName = agg.fieldName();
        }
      }
      return fieldName;
    }

    function drawWmsOverlays() {
      map.clearWMSOverlays();
      if ($scope.vis.params.overlays.wmsOverlays.length === 0) {
        return;
      }

      var source = new courier.SearchSource();
      var appState = getAppState();
      source.set('filter', queryFilter.getFilters());
      if (appState.query && !appState.linked) {
        source.set('query', appState.query);
      }
      source._flatten().then(function (fetchParams) {
        var esQuery = fetchParams.body.query;
        //remove kibana parts of query
        var cleanedMust = [];
        if (_lodash2.default.has(esQuery, 'filtered.filter.bool.must')) {
          esQuery.filtered.filter.bool.must.forEach(function (must) {
            cleanedMust.push(_lodash2.default.omit(must, ['$state', '$$hashKey']));
          });
        }
        esQuery.filtered.filter.bool.must = cleanedMust;
        var cleanedMustNot = [];
        if (_lodash2.default.has(esQuery, 'filtered.filter.bool.must_not')) {
          esQuery.filtered.filter.bool.must_not.forEach(function (mustNot) {
            cleanedMustNot.push(_lodash2.default.omit(mustNot, ['$state', '$$hashKey']));
          });
        }
        esQuery.filtered.filter.bool.must_not = cleanedMustNot;
        var escapedQuery = JSON.stringify(esQuery).replace(new RegExp('[,]', 'g'), '\\,');

        $scope.vis.params.overlays.wmsOverlays.forEach(function (layerParams) {
          var name = _lodash2.default.get(layerParams, 'displayName', layerParams.layers);
          var options = {
            format: 'image/png',
            layers: layerParams.layers,
            maxFeatures: _lodash2.default.get(layerParams, 'maxFeatures', 1000),
            transparent: true,
            version: '1.1.1'
          };
          if (_lodash2.default.get(layerParams, 'viewparams')) {
            options.viewparams = 'q:' + escapedQuery;
          }
          map.addWmsOverlay(layerParams.url, name, options);
        });
      });
    }

    function appendMap() {
      var initialMapState = utils.getMapStateFromVis($scope.vis);
      var params = $scope.vis.params;
      var container = $element[0].querySelector('.tilemap');
      map = new TileMapMap(container, {
        center: initialMapState.center,
        zoom: initialMapState.zoom,
        callbacks: callbacks,
        mapType: params.mapType,
        attr: params,
        editable: $scope.vis.getEditableVis() ? true : false
      });

      if($scope.vis.aggs[1] && $scope.vis.aggs[1].params.autoPrecision)
        $scope.vis.aggs[1].params.precision = 2;
    }

    function resizeArea() {
      if (map) map.updateSize();
    }
  });
}); /*
     * Had to rework original tilemap functionallity to migrate 
     * to TemplateVisType. Combined pieces from 
     *   plugins/kbn_vislib_vis_types/public/tileMap.js
     *   ui/public/vislib/visualizations/tile_map.js
     */
