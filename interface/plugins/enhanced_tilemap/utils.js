"use strict";

define(function (require) {
  var _ = require('lodash');

  /**
   * Get the number of geohash cells for a given precision
   *
   * @param {number} precision the geohash precision (1<=precision<=12).
   * @param {number} axis constant for the axis 0=lengthwise (ie. columns, along longitude), 1=heightwise (ie. rows, along latitude).
   * @returns {number} Number of geohash cells (rows or columns) at that precision
   */
  function geohashCells(precision, axis) {
    var cells = 1;
    for (var i = 1; i <= precision; i += 1) {
      //On odd precisions, rows divide by 4 and columns by 8. Vice-versa on even precisions.
      cells *= i % 2 === axis ? 4 : 8;
    }
    return cells;
  }

  /**
   * Get the number of geohash columns (world-wide) for a given precision
   * @param precision the geohash precision
   * @returns {number} the number of columns
   */
  function geohashColumns(precision) {
    return geohashCells(precision, 0);
  }

  function precisionScale(maxPrecision) {
    var zoomPrecision = {};
    var minGeohashPixels = 16;
    for (var zoom = 0; zoom <= 21; zoom += 1) {
      var worldPixels = 256 * Math.pow(2, zoom);
      zoomPrecision[zoom] = 1;
      for (var precision = 2; precision <= maxPrecision; precision += 1) {
        var columns = geohashColumns(precision);
        if (worldPixels / columns >= minGeohashPixels) {
          zoomPrecision[zoom] = precision;
        } else {
          break;
        }
      }
    }
    return zoomPrecision;
  }

  return {
    /* 
     * @param bounds {LatLngBounds}
     * @param scale {number}
     * @return {object}
     */
    scaleBounds: function scaleBounds(bounds, scale) {
      var safeScale = scale;
      if (safeScale < 1) scale = 1;
      if (safeScale > 5) scale = 5;
      safeScale = safeScale - 1;

      var topLeft = bounds.getNorthWest();
      var bottomRight = bounds.getSouthEast();
      var latDiff = Math.abs(topLeft.lat - bottomRight.lat).toFixed(5);
      var lonDiff = Math.abs(bottomRight.lng - topLeft.lng).toFixed(5);
      //map height can be zero when vis is first created
      if (latDiff === 0) latDiff = lonDiff;

      var latDelta = latDiff * safeScale;
      var topLeftLat = topLeft.lat.toFixed(5) + latDelta;
      if (topLeftLat > 90) topLeftLat = 90;
      var bottomRightLat = bottomRight.lat.toFixed(5) - latDelta;
      if (bottomRightLat < -90) bottomRightLat = -90;
      var lonDelta = lonDiff * safeScale;
      var topLeftLon = topLeft.lng.toFixed(5) - lonDelta;
      if (topLeftLon < -180) topLeftLon = -180;
      var bottomRightLon = bottomRight.lng.toFixed(5) + lonDelta;
      if (bottomRightLon > 180) bottomRightLon = 180;

      //console.log("scale:" + safeScale + ", latDelta: " + latDelta + ", lonDelta: " + lonDelta);
      //console.log("top left lat " + _.round(topLeft.lat, 5) + " -> " + topLeftLat);
      //console.log("bottom right lat " + _.round(bottomRight.lat, 5) + " -> " + bottomRightLat);
      //console.log("top left lon " + _.round(topLeft.lng, 5) + " -> " + topLeftLon);
      //console.log("bottom right lon " + _.round(bottomRight.lng, 5) + " -> " + bottomRightLon);

      return {
        "top_left": { lat: topLeftLat, lon: topLeftLon },
        "bottom_right": { lat: bottomRightLat, lon: bottomRightLon }
      };
    },
    contains: function contains(collar, bounds) {
			if(collar) {
      	//test if bounds top_left is inside collar
      	if (bounds.top_left.lat > collar.top_left.lat || bounds.top_left.lon < collar.top_left.lon) return false;

      	//test if bounds bottom_right is inside collar
      	if (bounds.bottom_right.lat < collar.bottom_right.lat || bounds.bottom_right.lon > collar.bottom_right.lon) return false;
			}

      //both corners are inside collar so collar contains 
      return true;
    },
    getAggConfig: function getAggConfig(aggs, aggName) {
      var aggConfig = null;
      index = _.findIndex(aggs, function (agg) {
        return agg.schema.name === aggName;
      });
      if (index !== -1) {
        aggConfig = aggs[index];
      }
      return aggConfig;
    },
    getMapStateFromVis: function getMapStateFromVis(vis) {
      var mapState = {
        center: [15, 5],
        zoom: 2
      };
      _.keys(vis.aggs).forEach(function (key) {
        if (key !== 'vis' && _.has(vis.aggs[key], "params.mapCenter")) {
          mapState.center = vis.aggs[key].params.mapCenter;
          mapState.zoom = vis.aggs[key].params.mapZoom;
        }
      });
      return mapState;
    },
    getPrecision: function getPrecision(zoom, maxPrecision) {
      var scale = precisionScale(maxPrecision);
      return scale[zoom];
    }


    // getFeaturesInRectangle: function(bounds, features) {
    //   return features.map(function(f) {
    //     if(f.geometry.coordinates[0] > bounds.top_left.lon && f.geometry.coordinates[0] < bounds.bottom_right.lon &&
    //        f.geometry.coordinates[1] < bounds.top_left.lat && f.geometry.coordinates[1] > bounds.bottom_right.lat) {
    //          return f.properties.geohash;
    //     }
    //   }).filter(Boolean);
    // }
  };
});
