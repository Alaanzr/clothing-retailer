retailerApp.factory('Item', ['$resource', function($resource) {
  return $resource('items/items.json', {}, {
    query: {method: 'GET', isArray:true }
  });
}]);
