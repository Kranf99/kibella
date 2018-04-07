define(function (require) {
  return require('ui/registry/_registry')({
    name: 'apps',
    index: ['name'],
    order: ['order']
  });
});