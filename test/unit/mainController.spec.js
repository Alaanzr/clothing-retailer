'use strict';

describe('MainCtrl', function() {

  var ctrl, $httpBackend;

  var item1 = {
    productName: 'Suede Shoes, Blue',
    category: 'Women\'s Footwear',
    price: 42.00,
    quantityInStock: 4
  };

  var item2 = {
    productName: 'Gold Button Cardigan, Black',
    category: 'Women\'s Casualwear',
    price: 167.00,
    quantityInStock: 6
  };

  var item3 = {
    productName: 'Suede Shoes, Blue',
    category: 'Women\'s Footwear',
    price: 100.00,
    quantityInStock: 4
  };

  beforeEach(function() {
    jasmine.addMatchers({
      toEqualData: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            return {
              pass: angular.equals(actual, expected)
            };
          }
        };
      }
    });
  });

  beforeEach(module('retailerApp'));

  beforeEach(inject(function($controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('items/items.json').respond([item1]);
    ctrl = $controller('MainCtrl');
  }));

  it('should not contain item data prior to calling the Item Service', function() {
    expect(ctrl.items).toEqualData([]);
  });

  it('should contain item data after calling the Item Service', function() {
    $httpBackend.flush();
    expect(ctrl.items).toEqualData([
      item1
    ]);
  });

  describe('Cart functionality', function() {

    it('should not show items in the cart prior to adding said item', function() {
      expect(ctrl.cart).toEqualData([]);
    });

    it('should have a total of £0.00 initially', function() {
      expect(ctrl.total).toBe(0);
    });

    describe('Adding Items', function() {

      beforeEach(function() {
        item1.quantityInStock = 4;
        ctrl.addItem(item1);
      });

      it('should show items in the cart after adding said item', function() {
        expect(ctrl.cart).toEqualData([item1]);
      });

      it('should add to the customer\'s total', function() {
        expect(ctrl.total).toBe(42);
      });

      it('should reduce the quantityInStock for the associated item', function() {
        expect(item1.quantityInStock).toBe(3);
      });

      describe('Removing Items', function() {

        beforeEach(function() {
          ctrl.removeItem(item1);
        });

        it('should remove the relevant item from the cart', function() {
          expect(ctrl.cart.length).toBe(0);
        });

        it('should reduce the order total', function() {
          expect(ctrl.total).toBe(0);
        });

        it('should revert the item\'s quantityInStock back to its original value', function() {
          expect(item1.quantityInStock).toBe(4);
        });

        it('should revert the item quantity back to 0', function() {
          expect(item1.quantityOrdered).toBe(0);
        });
      });
    });

    describe('Applying Discounts', function() {

      beforeEach(function() {
        item1.quantityInStock = 4;
        item2.quantityInStock = 6;
        item3.quantityInStock = 4;
      });

      it('should not allow the user to apply a discount when their order total is £0', function() {
        ctrl.processDiscount('FIVE');
        expect(ctrl.discount).toBe(0);
      });

      it('should apply a £5 discount when the correct code is used', function() {
        ctrl.addItem(item2);
        ctrl.processDiscount('FIVE');
        expect(ctrl.discount).toBe(5);
        expect(ctrl.total).toBe(162);
      });

      it('should not apply a £10 discount when the order total is below £50', function() {
        ctrl.addItem(item1);
        ctrl.processDiscount('TEN');
        expect(ctrl.discount).toBe(0);
        expect(ctrl.total).toBe(42);
      });

      it('should not apply a £15 discount when the order total is below £75 and footwear is not in the user\'s cart', function() {
        ctrl.addItem(item2);
        ctrl.processDiscount('FIFTEEN');
        expect(ctrl.discount).toBe(0);
        expect(ctrl.total).toBe(167);
      });

      it('should apply a £15 discount when the order total is above £75 and footwear is included in the user\'s cart', function() {
        ctrl.addItem(item1);
        ctrl.addItem(item2);
        ctrl.processDiscount('FIFTEEN');
        expect(ctrl.discount).toBe(15);
        expect(ctrl.total).toBe(194);
      });

      it('should not allow the discount to persist when a user removes an item from their cart that invalidates the voucher', function() {
        ctrl.addItem(item1);
        ctrl.addItem(item2);
        ctrl.processDiscount('FIFTEEN');
        ctrl.removeItem(item1);
        expect(ctrl.discount).toBe(0);
        expect(ctrl.total).toBe(167);
      });

      it('should not allow the discount to persist when a user adds an item, applies a discount and then removes the item', function() {
        ctrl.addItem(item1);
        ctrl.processDiscount('FIVE');
        ctrl.removeItem(item1);
        expect(ctrl.discount).toBe(0);
        expect(ctrl.total).toBe(0);
      });

      it('should allow the discount to persist when a user removes an item from their cart that does not invalidate the voucher', function() {
        ctrl.addItem(item3);
        ctrl.addItem(item2);
        ctrl.processDiscount('FIFTEEN');
        ctrl.removeItem(item2);
        expect(ctrl.discount).toBe(15);
        expect(ctrl.total).toBe(85);
      });

      it('should not allow multiple discounts', function() {
        ctrl.addItem(item1);
        ctrl.processDiscount('FIVE');
        ctrl.processDiscount('FIVE');
        expect(ctrl.discount).toBe(5);
        expect(ctrl.total).toBe(37);
      });
    });

    describe('Error reporting', function() {

      beforeEach(function() {
        item1.quantityInStock = 4;
        ctrl.addItem(item1);
      });

      it('should raise an error when an invalid code is used', function() {
        ctrl.processDiscount('INVALID');
        expect(ctrl.errors[0]).toBe('Invalid code');
      });

      it('should raise an error when a user attempts to redeem more than one code', function() {
        ctrl.processDiscount('FIVE');
        ctrl.processDiscount('TEN');
        expect(ctrl.errors[0]).toBe('You have already redeemed a code');
      });

      it('should raise an error when a voucher condition is not met', function() {
        ctrl.removeItem(item1);
        ctrl.processDiscount('FIVE');
        expect(ctrl.errors[0]).toBe('Condition not met');
      });

    });
  });
});
