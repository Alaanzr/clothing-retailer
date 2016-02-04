retailerApp.controller('ItemCtrl', ['$scope', 'Item', function($scope, Item) {

  $scope.items = Item.query();
  $scope.total = 0;
  $scope.discount = 0;
  $scope.cart = [];
  $scope.categoriesInCart = [];
  $scope.errors = [];
  $scope.activeDiscount = '';

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

  $scope.processDiscount = function(code) {
    var discountInfo = $scope.retrieveDiscountInfo();
    $scope.processErrors(code, discountInfo);
    for (var key in discountInfo) {
      if (code === key && discountInfo[key].condition) {
        $scope.applyDiscount(discountInfo, key);
      }
    };
  };

  // PRIVATE

  $scope.modifyItemPropsAdd = function(item) {
    item.quantityInStock -= 1;
    $scope.isInCart(item) ? item.quantityOrdered += 1 : item.quantityOrdered = 1;
  };

  $scope.modifyCartAdd = function(item) {
    $scope.total += item.price;
    $scope.categoriesInCart.push(item.category);
    if (!$scope.isInCart(item)) $scope.cart.push(item);
  };

  $scope.modifyCartRm = function(item) {
    $scope.cart.splice($scope.cart.indexOf(item), 1);
    $scope.categoriesInCart.splice($scope.categoriesInCart.indexOf(item.category), 1);
    if ($scope.discount > 0 && $scope.verifyDiscount() !== true) {
      $scope.total -= (item.price * item.quantityOrdered) - $scope.discount;
      $scope.discount = 0;
    } else {
      $scope.total -= (item.price * item.quantityOrdered);
    }
  };

  $scope.modifyItemPropsRm = function(item) {
    item.quantityInStock += item.quantityOrdered;
    item.quantityOrdered = 0;
  };

  $scope.isInCart = function(item) {
    for (var i = 0; i < $scope.cart.length; i++) {
      if ($scope.cart[i].productName === item.productName) {
        return $scope.cart[i].isInCart = true;
      }
    };
  };

  $scope.reviewCartCategories = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return $scope.categoriesInCart.some(function(elm) {
      return args.indexOf(elm) !== -1;
    });
  };

  $scope.applyDiscount = function(discountInfo, key) {
    var discount = discountInfo[key].discount;
    if ($scope.total > discount && $scope.discount === 0) {
      $scope.discount += discount;
      $scope.total -= discount;
      $scope.activeDiscount = key;
      $scope.discountCode = '';
    }
  };

  $scope.retrieveDiscountInfo = function() {
    return {
      'FIVE': {
        condition: true,
        discount: 5
      },
      'TEN': {
        condition: $scope.total > 50,
        discount: 10
      },
      'FIFTEEN': {
        condition: $scope.total > 75 && $scope.reviewCartCategories('Men\'s Footwear', 'Women\'s Footwear'),
        discount: 15
      }
    };
  };

  $scope.processErrors = function(code, discountInfo) {
    $scope.errors = [];
    if (Object.keys(discountInfo).indexOf(code) === -1) $scope.errors.push('Invalid code');
    if ($scope.discount > 0) $scope.errors.push('You have already redeemed a code');
  };

  $scope.verifyDiscount = function() {
    var discountInfo = $scope.retrieveDiscountInfo();
    if (discountInfo[$scope.activeDiscount].condition === true) return true;
  };
}]);
