(function() {
  'use strict';

  angular.module('retailerApp').controller('MainCtrl', ['Item', 'Discount', 'SweetAlert', function(Item, Discount, SweetAlert) {
    var vm = this;

    vm.items = Item.query();
    vm.total = 0;
    vm.discount = 0;
    vm.cart = [];
    vm.categoriesInCart = [];

    vm.addItem = function(item) {
      vm.itemPropertiesAdd(item);
      vm.addToCart(item);
    };

    vm.removeItem = function(item) {
      vm.removeFromCart(item);
      vm.itemPropertiesRemove(item);
      vm.revertDiscounts();
    };

    vm.isInStock = function(item) {
      return item.quantityInStock > 0 ? true : false;
    };

    vm.processDiscount = function(code) {
      var discountInfo = Discount.discountInfo(vm.total, vm.categoriesInCart);
      var isCodeValid = Object.keys(discountInfo).indexOf(code) !== -1;
      vm.processErrors(code, discountInfo, isCodeValid);
      if (isCodeValid && discountInfo[code].condition) vm.applyDiscount(discountInfo[code].discount, code);
      vm.discountCode = '';
    };

    // PRIVATE

    vm.itemPropertiesAdd = function(item) {
      item.quantityInStock -= 1;
      return vm.isInCart(item) ? item.quantityOrdered += 1 : item.quantityOrdered = 1;
    };

    vm.addToCart = function(item) {
      vm.total += item.price;
      vm.categoriesInCart.push(item.category);
      if (!vm.isInCart(item)) vm.cart.push(item);
    };

    vm.removeFromCart = function(item) {
      vm.cart.splice(vm.cart.indexOf(item), 1);
      vm.categoriesInCart.splice(vm.categoriesInCart.indexOf(item.category), 1);
      vm.total -= (item.price * item.quantityOrdered);
    };

    vm.revertDiscounts = function() {
      if (vm.discount > 0 && vm.verifyDiscount() !== true) {
        vm.total += vm.discount;
        vm.discount = 0;
      }
    };

    vm.itemPropertiesRemove = function(item) {
      item.quantityInStock += item.quantityOrdered;
      item.quantityOrdered = 0;
    };

    vm.isInCart = function(item) {
      for (var i = 0; i < vm.cart.length; i++) {
        if (vm.cart[i] === item) return true;
      }
    };

    vm.applyDiscount = function(discount, key) {
      if (vm.total > discount && vm.discount === 0) {
        vm.discount += discount;
        vm.total -= discount;
        vm.activeDiscount = key;
        SweetAlert.saSuccess(vm.discount);
      }
    };

    vm.verifyDiscount = function() {
      var discountInfo = Discount.discountInfo(vm.total, vm.categoriesInCart);
      if (discountInfo[vm.activeDiscount].condition) return true;
    };

    vm.processErrors = function(code, discountInfo, isCodeValid) {
      vm.errors = [];
      if (!isCodeValid) vm.errors.push('Invalid code');
      if (vm.discount > 0) vm.errors.push('You have already redeemed a code');
      if (isCodeValid && discountInfo[code].condition === false) vm.errors.push('Condition not met');
      if (vm.errors.length > 0) SweetAlert.saError(vm.errors);
    };

  }]);
})();
