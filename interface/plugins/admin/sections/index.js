define(function (require) { 
  // each of these private modules returns an object defining that section, their properties 
  // are used to create the nav bar 
  return [ 
    require('plugins/admin/sections/manage/index'), 
    require('plugins/admin/sections/create/index'), 
    require('plugins/admin/sections/insert/index'), 
    require('plugins/admin/sections/cache/index'), 
  ]; 
});