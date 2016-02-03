retailerApp.controller('ItemCtrl', ['$scope', 'Item', function($scope, Item) {

  $scope.items = Item.query();
  $scope.total = 0;
  $scope.categoriesInCart = [];
  $scope.discountActive = false;
  $scope.cart = [];

  $scope.addItem = function(item) {
      $scope.modifyItemProps(item);
      $scope.modifyCartAdd(item);
  };

  $scope.removeItem = function(item) {
    $scope.modifyCartRm(item);
  };

  $scope.isInStock = function(item) {
    return item.quantityInStock > 0 ? true : false;
  }

  // PRIVATE

  $scope.modifyItemProps = function(item) {
    item.quantityInStock -=1;
    $scope.isInCart(item) ? item.quantity += 1 : item.quantity = 1;
  };

  $scope.modifyCartAdd = function(item) {
      $scope.total += item.price;
      $scope.categoriesInCart.push(item.category);
      $scope.cart.push(item);
  };

  $scope.modifyCartRm = function(item) {
    $scope.cart.splice($scope.cart.indexOf(item), 1);
    item.quantityInStock += item.quantity;
    $scope.total -= item.price * item.quantity;
    item.quantity = 0;
  };

  $scope.isInCart = function(item) {
    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].productName === item.productName) {
        return $scope.cart[i].isInCart = true;
      };
    };
  };

  $scope.reviewCartCategories = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return $scope.categoriesInCart.some(function(elm) {
      return args.indexOf(elm) !== -1;
    });
  };
}]);
