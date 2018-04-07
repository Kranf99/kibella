'use strict';

require('leaflet');
require('./../lib/leaflet.sync/L.Map.Sync');

var singleton = function () {
  var maps = [];
  var _sync = true;
  var syncOptions = {
    syncCursor: false
  };

  function syncMaps(mapA, mapB) {
    mapA.sync(mapB, syncOptions);
    mapB.sync(mapA, syncOptions);
  }

  function unsyncMaps(mapA, mapB) {
    mapA.unsync(mapB);
    mapB.unsync(mapA);
  }

  return {
    add: function add(newmap) {
      if (_sync) {
        maps.forEach(function (map) {
         	syncMaps(newmap, map);
        });
      }
      maps.push(newmap);
    },
    remove: function remove(oldmap) {
      maps.forEach(function (map) {
        if (oldmap != map) unsyncMaps(oldmap, map);
      });
      for (var i = 0; i < maps.length; i++) {
        if (maps[i] == oldmap) {
          maps.splice(i, 1);
          break;
        }
      }
    },
    sync: function sync() {
      if (_sync) return;
      _sync = true;
      for (var i = 0; i < maps.length; i++) {
        for (var j = i; j < maps.length; j++) {
          syncMaps(maps[i], maps[j]);
        }
      }
    },
    unsync: function unsync() {
      if (!_sync) return;
      _sync = false;
      for (var i = 0; i < maps.length; i++) {
        for (var j = i; j < maps.length; j++) {
          unsyncMaps(maps[i], maps[j]);
        }
      }
    }
  };
}();

module.exports = singleton;
