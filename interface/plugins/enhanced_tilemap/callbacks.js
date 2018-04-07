'use strict';

define(function (require) {
  return function CallbacksFactory(Private, courier, config) {
    var _ = require('lodash');
    var geoFilter = Private(require('plugins/enhanced_tilemap/vislib/geoFilter'));
    var utils = require('plugins/enhanced_tilemap/utils');

    return {
      createMarker: function createMarker(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;
        var editableVis = agg.vis.getEditableVis();
        if (!editableVis) return;
        var newPoint = [event.latlng.lat.toFixed(5),event.latlng.lng.toFixed(5)];
        editableVis.params.markers.push(newPoint);
      },
      deleteMarkers: function deleteMarkers(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;
        var editableVis = agg.vis.getEditableVis();
        if (!editableVis) return;

        event.deletedLayers.eachLayer(function (layer) {
          editableVis.params.markers = editableVis.params.markers.filter(function (point) {
            if (point[0] === layer._latlng.lat && point[1] === layer._latlng.lng) {
              return false;
            } else {
              return true;
            }
          });
        });
      },
      mapMoveEnd: function mapMoveEnd(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;

        //Fetch new data if map bounds are outsize of collar
        var bounds = utils.scaleBounds(event.mapBounds, 1);
        if (!utils.contains(event.collar, bounds)) {
          courier.fetch();
        }

        var center = [event.center.lat.toFixed(5), event.center.lng.toFixed(5)];

        var editableVis = agg.vis.getEditableVis();
        if (!editableVis) return;
        editableVis.params.mapCenter = center;
        editableVis.params.mapZoom = event.zoom;

        var editableAgg = editableVis.aggs.byId[agg.id];
        if (editableAgg) {
          editableAgg.params.mapZoom = event.zoom;
          editableAgg.params.mapCenter = center;
        }
      },
      mapZoomEnd: function mapZoomEnd(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg || !agg.params.autoPrecision) return;

        //Set precision when filter applied to ensure zoom level and precision are never out of sync
        agg.params.precision = 2;

        courier.fetch();
      },
      poiFilter: function poiFilter(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;

        var field = agg.fieldName();
        var indexPatternName = agg.vis.indexPattern.id;

        var filters = [];
        event.poiLayers.forEach(function (poiLayer) {
          poiLayer.getLayers().forEach(function (feature) {
            if (feature instanceof L.Marker) {
              var filter = { geo_distance: { distance: event.radius + "km" } };
              filter.geo_distance[field] = {
                "lat": feature.getLatLng().lat,
                "lon": feature.getLatLng().lng
              };
              filters.push(filter);
            }
          });
        });
        geoFilter.add(filters, field, indexPatternName);
      },
      polygon: function polygon(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;
        var indexPatternName = agg.vis.indexPattern.id;

        var newFilter = void 0;
        var field = void 0;
        if (event.params.filterByShape && event.params.shapeField) {
          var firstPoint = event.points[0];
          var closed = event.points;
          closed.push(firstPoint);
          field = event.params.shapeField;
          newFilter = { geo_shape: {} };
          newFilter.geo_shape[field] = {
            shape: {
              type: 'Polygon',
              coordinates: [closed]
            }
          };
        } else {
          field = agg.fieldName();
          newFilter = { geo_polygon: {} };
          newFilter.geo_polygon[field] = { points: event.points };
        }

        geoFilter.add(newFilter, field, indexPatternName);
      },
      rectangle: function rectangle(event) {
        var agg = _.get(event, 'chart.geohashGridAgg');
        if (!agg) return;
        var indexPatternName = agg.vis.indexPattern.id;

        console.log(agg);
        console.log(event);

        var newFilter = void 0;
        var field = void 0;
        event.bounds.top_left.lat = parseFloat(event.bounds.top_left.lat);
        event.bounds.bottom_right.lon = parseFloat(event.bounds.bottom_right.lon);

        if (event.params.filterByShape && event.params.shapeField) {
          field = event.params.shapeField;
          newFilter = { geo_shape: {} };
          newFilter.geo_shape[field] = {
            shape: {
              type: 'envelope',
              coordinates: [[event.bounds.top_left.lon, event.bounds.top_left.lat], [event.bounds.bottom_right.lon, event.bounds.bottom_right.lat]]
            }
          };
        } else {
          field = agg.fieldName();
          newFilter = { geo_bounding_box: {} };
          newFilter.geo_bounding_box[field] = event.bounds;
        }

        // if (event.params.filterByShape && event.params.shapeField) {
        //   field = event.params.shapeField;
        //   newFilter = { match: {} };
        //   newFilter.match[field] = {
        //     shape: {
        //       type: 'envelope',
        //       geohashes: utils.getFeaturesInRectangle(event.bounds, event.chart.geoJson.features)
        //       // coordinates: [[event.bounds.top_left.lon, event.bounds.top_left.lat], [event.bounds.bottom_right.lon, event.bounds.bottom_right.lat]]
        //     }
        //   };
        // } else {
        //   field = agg.fieldName();
        //   newFilter = { query: { match: { } } };
        //   newFilter.query.match[field] = { query: utils.getFeaturesInRectangle(event.bounds, event.chart.geoJson.features), type: 'phrase'};
        // }

        geoFilter.add(newFilter, field, indexPatternName);
      }
    };
  };
});
