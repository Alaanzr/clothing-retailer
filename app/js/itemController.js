retailerApp.controller('ItemCtrl', ['$scope', 'Item', function($scope, Item) {

  $scope.items = Item.query();
  $scope.total = 0;
  $scope.discount = 0;
  $scope.cart = [];
  $scope.categoriesInCart = [];

  $scope.addItem = function(item) {
    $scope.modifyItemPropsAdd(item);
    $scope.modifyCartAdd(item);
  };

  $scope.removeItem = function(item) {
    $scope.modifyCartRm(item);
    $scope.modifyItemPropsRm(item);
  };

  $scope.isInStock = function(item) {
    return item.quantityInStock > 0 ? true : false;
  };

  $scope.applyDiscount = function(code) {
    var discountConditions = {'FIVE': true, 'TEN': $scope.total > 50, 'FIFTEEN': $scope.total > 75 && $scope.reviewCartCategories('Men\'s Footwear', 'Women\'s Footwear')};
    if (discountConditions.hasOwnProperty(code)) {
      for (var key in discountConditions) {
        if (key === code) {
          if (discountConditions[code] === true && $scope.discount === 0) {
            if ($scope.total > 5 * (Object.keys(discountConditions).indexOf(code) + 1)) {
              $scope.discount += 5 * (Object.keys(discountConditions).indexOf(code) + 1);
              $scope.total -= 5 * (Object.keys(discountConditions).indexOf(code) + 1);
              $scope.discountCode = '';
            };
          };
        }
      };
    };
  };

  // PRIVATE

  $scope.modifyItemPropsAdd = function(item) {
    item.quantityInStock -=1;
    $scope.isInCart(item) ? item.quantityInCard += 1 : item.quantityInCart = 1;
  };

  $scope.modifyCartAdd = function(item) {
      $scope.total += item.price;
      $scope.categoriesInCart.push(item.category);
      $scope.cart.push(item);
  };

  $scope.modifyCartRm = function(item) {
    $scope.cart.splice($scope.cart.indexOf(item), 1);
    $scope.total -= (item.price * item.quantityInCart) - $scope.discount;
    $scope.discount = 0;
  };

  $scope.modifyItemPropsRm = function(item) {
    item.quantityInStock += item.quantityInCart;
    item.quantityInCart = 0;
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
