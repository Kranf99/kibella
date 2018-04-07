'use strict';

define(function (require) {
  var LAT_INDEX = 1;
  var LON_INDEX = 0;

  return function GeoFilterFactory(Private) {
    var _ = require('lodash');
    var queryFilter = Private(require('ui/filter_bar/query_filter'));

    function filterAlias(field, numBoxes) {
      return field + ": " + numBoxes + " geo filters";
    }

    function addGeoFilter(newFilter, field, indexPatternName) {
      var existingFilter = null;
      _.flatten([queryFilter.getAppFilters(), queryFilter.getGlobalFilters()]).forEach(function (it) {
        if (isGeoFilter(it, field)) {
          existingFilter = it;
        }
      });

      if (existingFilter) {
        var geoFilters = _.flatten([newFilter]);
        var type = '';
        if (_.has(existingFilter, 'or')) {
          geoFilters = geoFilters.concat(existingFilter.or);
          type = 'or';
        } else if (_.has(existingFilter, 'geo_bounding_box')) {
          geoFilters.push({ geo_bounding_box: existingFilter.geo_bounding_box });
          type = 'geo_bounding_box';
        } else if (_.has(existingFilter, 'geo_polygon')) {
          geoFilters.push({ geo_polygon: existingFilter.geo_polygon });
          type = 'geo_polygon';
        } else if (_.has(existingFilter, 'geo_shape')) {
          geoFilters.push({ geo_shape: existingFilter.geo_shape });
          type = 'geo_shape';
        }
        queryFilter.updateFilter({
          model: geoFilters,
          source: existingFilter,
          type: type,
          alias: filterAlias(field, geoFilters.length)
        });
      } else {
        var numFilters = 1;
        if (_.isArray(newFilter)) {
          numFilters = newFilter.length;
          newFilter = newFilter;
        }
        newFilter.meta = {
          alias: filterAlias(field, numFilters),
          negate: false,
          index: indexPatternName,
          key: field
        };
        queryFilter.addFilters(newFilter);
      }
    }

    /**
     * Convert elasticsearch geospatial filter to leaflet vectors
     *
     * @method toVector
     * @param filter {Object} elasticsearch geospatial filter
     * @param field {String} Index field name for geo_point or geo_shape field
     * @return {Array} Array of Leaftet Vector Layers constructed from filter geometries
     */
    function toVector(filter, field) {
      var features = [];
      if (_.has(filter, 'or')) {
        _.get(filter, 'or', []).forEach(function (it) {
          features = features.concat(toVector(it, field));
        });
      } else if (_.has(filter, 'geo_bounding_box.' + field)) {
        var topLeft = _.get(filter, 'geo_bounding_box.' + field + '.top_left');
        var bottomRight = _.get(filter, 'geo_bounding_box.' + field + '.bottom_right');
        if (topLeft && bottomRight) {
          var bounds = L.latLngBounds([topLeft.lat, topLeft.lon], [bottomRight.lat, bottomRight.lon]);
          features.push(L.rectangle(bounds));
        }
      } else if (_.has(filter, 'geo_distance.' + field)) {
        var distance_str = _.get(filter, 'geo_distance.distance');
        var distance = 1000;
        if (_.includes(distance_str, 'km')) {
          distance = parseFloat(distance_str.replace('km', '')) * 1000;
        }
        var center = _.get(filter, 'geo_distance.' + field);
        if (center) {
          features.push(L.circle([center.lat, center.lon], distance));
        }
      } else if (_.has(filter, 'geo_polygon.' + field)) {
        (function () {
          var points = _.get(filter, 'geo_polygon.' + field + '.points', []);
          var latLngs = [];
          points.forEach(function (point) {
            var lat = point[LAT_INDEX];
            var lon = point[LON_INDEX];
            latLngs.push(L.latLng(lat, lon));
          });
          if (latLngs.length > 0) features.push(L.polygon(latLngs));
        })();
      } else if (_.has(filter, 'geo_shape.' + field)) {
        var type = _.get(filter, 'geo_shape.' + field + '.shape.type');
        if (type.toLowerCase() === 'envelope') {
          var envelope = _.get(filter, 'geo_shape.' + field + '.shape.coordinates');
          var tl = envelope[0]; //topleft
          var br = envelope[1]; //bottomright
          var _bounds = L.latLngBounds([tl[LAT_INDEX], tl[LON_INDEX]], [br[LAT_INDEX], br[LON_INDEX]]);
          features.push(L.rectangle(_bounds));
        } else if (type.toLowerCase() === 'polygon') {
          (function () {
            coords = _.get(filter, 'geo_shape.' + field + '.shape.coordinates')[0];
            var latLngs = [];
            coords.forEach(function (point) {
              var lat = point[LAT_INDEX];
              var lon = point[LON_INDEX];
              latLngs.push(L.latLng(lat, lon));
            });
            features.push(L.polygon(latLngs));
          })();
        } else {
          console.log("Unexpected geo_shape type: " + type);
        }
      }
      return features;
    }

    function getGeoFilters(field) {
      var filters = [];
      _.flatten([queryFilter.getAppFilters(), queryFilter.getGlobalFilters()]).forEach(function (it) {
        if (isGeoFilter(it, field) && !_.get(it, 'meta.disabled', false)) {
          var features = toVector(it, field);
          filters = filters.concat(features);
        }
      });
      return filters;
    }

    function isGeoFilter(filter, field) {
      if (filter.meta.key === field || _.has(filter, 'geo_bounding_box.' + field) || _.has(filter, 'geo_distance.' + field) || _.has(filter, 'geo_polygon.' + field) || _.has(filter, 'or[0].geo_bounding_box.' + field) || _.has(filter, 'or[0].geo_distance.' + field) || _.has(filter, 'or[0].geo_polygon.' + field) || _.has(filter, 'geo_shape.' + field) || _.has(filter, 'or[0].geo_shape.' + field)) {
        return true;
      } else {
        return false;
      }
    }

    return {
      add: addGeoFilter,
      isGeoFilter: isGeoFilter,
      getGeoFilters: getGeoFilters
    };
  };
});