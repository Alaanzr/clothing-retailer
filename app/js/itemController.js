retailerApp.controller('ItemCtrl', ['$scope', 'Item', function($scope, Item) {

  $scope.items = Item.query();
  $scope.total = 0;

  $scope.cart = [];

  $scope.addItem = function(item) {
    if(item.quantityInStock > 0) {
      $scope.total += item.price;
      item.quantityInStock -=1;
      $scope.modifyCartAdd(item);
    };
  };

  $scope.removeItem = function(item) {
    var index = $scope.cart.indexOf(item);
    $scope.cart.splice(index, 1);
    $scope.modifyCartRm(item);
  };

  $scope.isInStock = function(item) {
    return item.quantityInStock > 0 ? true : false;
  }

  // PRIVATE

  $scope.isInCart = function(item) {
    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].productName === item.productName) {
        return $scope.cart[i].isInCart = true;
      };
    };
  };

  $scope.modifyCartAdd = function(item) {
    if ($scope.isInCart(item)) {
      item.quantity += 1;
    } else {
      item.quantity = 1;
      $scope.cart.push(item);
    }
  };

  $scope.modifyCartRm = function(item) {
    item.quantityInStock += item.quantity;
    $scope.total -= item.price * item.quantity;
    item.quantity = 0;
  };
}]);
