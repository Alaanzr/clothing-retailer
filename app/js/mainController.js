retailerApp.controller('MainCtrl', ['$scope', 'Item', 'Discount', function($scope, Item, Discount) {

  $scope.items = Item.query();
  $scope.total = 0;
  $scope.discount = 0;
  $scope.cart = [];
  $scope.categoriesInCart = [];

  $scope.addItem = function(item) {
    $scope.itemPropertiesAdd(item);
    $scope.addToCart(item);
  };

  $scope.removeItem = function(item) {
    $scope.removeFromCart(item);
    $scope.itemPropertiesRemove(item);
    $scope.revertDiscounts();
  };

  $scope.isInStock = function(item) {
    return item.quantityInStock > 0 ? true : false;
  };

  $scope.processDiscount = function(code) {
    var discountInfo = Discount.discountInfo($scope.total, $scope.categoriesInCart);
    var isCodeValid = Object.keys(discountInfo).indexOf(code) !== -1 && discountInfo[code].condition;
    if (isCodeValid) $scope.applyDiscount(discountInfo[code].discount, code)
    $scope.discountCode = '';
    $scope.processErrors(code, discountInfo);
  };

  // PRIVATE

  $scope.itemPropertiesAdd = function(item) {
    item.quantityInStock -= 1;
    $scope.isInCart(item) ? item.quantityOrdered += 1 : item.quantityOrdered = 1;
  };

  $scope.addToCart = function(item) {
    $scope.total += item.price;
    $scope.categoriesInCart.push(item.category);
    if (!$scope.isInCart(item)) $scope.cart.push(item);
  };

  $scope.removeFromCart = function(item) {
    $scope.cart.splice($scope.cart.indexOf(item), 1);
    $scope.categoriesInCart.splice($scope.categoriesInCart.indexOf(item.category), 1);
    $scope.total -= (item.price * item.quantityOrdered);
  };

  $scope.revertDiscounts = function() {
    if ($scope.discount > 0 && $scope.verifyDiscount() !== true) {
      $scope.total += $scope.discount;
      $scope.discount = 0;
    }
  };

  $scope.itemPropertiesRemove = function(item) {
    item.quantityInStock += item.quantityOrdered;
    item.quantityOrdered = 0;
  };

  $scope.isInCart = function(item) {
    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i] === item) return true;
    };
  };

  $scope.applyDiscount = function(discount, key) {
    if ($scope.total > discount && $scope.discount === 0) {
      $scope.discount += discount;
      $scope.total -= discount;
      $scope.activeDiscount = key;
    }
  };

  $scope.verifyDiscount = function() {
    var discountInfo = Discount.discountInfo($scope.total, $scope.categoriesInCart);
    if (discountInfo[$scope.activeDiscount].condition) return true;
  };

  $scope.processErrors = function(code, discountInfo) {
    $scope.errors = [];
    if (Object.keys(discountInfo).indexOf(code) === -1) $scope.errors.push('Invalid code');
    if ($scope.discount > 0) $scope.errors.push('You have already redeemed a code');
  };

}]);
