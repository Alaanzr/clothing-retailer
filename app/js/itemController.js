retailerApp.controller('ItemCtrl', ['$scope', 'Item', function($scope, Item) {
  $scope.items = Item.query();
}]);
