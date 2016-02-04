describe('ItemCtrl', function() {

  var scope, ctrl, $httpBackend;
  var item1 = {
    productName: 'Suede Shoes, Blue',
    category: 'Women\'s Footwear',
    price: 42.00,
    quantityInStock: 4
  };
  var item2;
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
        }
      }
    });
  });

  beforeEach(module('retailerApp'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('items/items.json').respond([item1]);
    scope = $rootScope.$new();
    ctrl = $controller('ItemCtrl', {
      $scope: scope
    });
  }));

  it('should not contain item data prior to calling the Item Service', function() {
    expect(scope.items).toEqualData([]);
  });

  it('should contain item data after calling the Item Service', function() {
    $httpBackend.flush();
    expect(scope.items).toEqualData([
      item1
    ])
  });

  describe('Cart functionality', function() {

    it('should not show items in the cart prior to adding said item', function() {
      expect(scope.cart).toEqualData([]);
    });

    it('should have a total of £0.00 initially', function() {
      expect(scope.total).toBe(0);
    });

    describe('Adding Items', function() {

      beforeEach(function() {
        item1 = {
          productName: 'Suede Shoes, Blue',
          category: 'Women\'s Footwear',
          price: 42.00,
          quantityInStock: 4
        }
        scope.addItem(item1);
      });

      it('should show items in the cart after adding said item', function() {
        expect(scope.cart).toEqualData([item1]);
      });

      it('should add to the customer\'s total', function() {
        expect(scope.total).toBe(42);
      });

      it('should reduce the quantityInStock for the associated item', function() {
        expect(item1.quantityInStock).toBe(3);
      });

      describe('Removing Items', function() {

        beforeEach(function() {
          scope.removeItem(item1);
        });

        it('should remove the relevant item from the cart', function() {
          expect(scope.cart.length).toBe(0);
        });

        it('should reduce the order total', function() {
          expect(scope.total).toBe(0);
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
        item2 = {
          productName: 'Gold Button Cardigan, Black',
          category: 'Women\'s Casualwear',
          price: 167.00,
          quantityInStock: 6
        }
      });

      it('should not allow the user to apply a discount when their order total is £0', function() {
        scope.processDiscount('FIVE');
        expect(scope.discount).toBe(0);
      });

      it('should apply a £5 discount when the correct code is used', function() {
        scope.addItem(item2);
        scope.processDiscount('FIVE');
        expect(scope.discount).toBe(5);
        expect(scope.total).toBe(162);
      });

      it('should not apply a £10 discount when the order total is below £50', function() {
        scope.addItem(item1);
        scope.processDiscount('TEN');
        expect(scope.discount).toBe(0);
        expect(scope.total).toBe(42);
      });

      it('should not apply a £15 discount when the order total is below £75 and footwear is not in the user\'s cart', function() {
        scope.addItem(item2);
        scope.processDiscount('FIFTEEN');
        expect(scope.discount).toBe(0);
        expect(scope.total).toBe(167);
      });

      it('should apply a £15 discount when the order total is above £75 and footwear is included in the user\'s cart', function() {
        scope.addItem(item1);
        scope.addItem(item2);
        scope.processDiscount('FIFTEEN');
        expect(scope.discount).toBe(15);
        expect(scope.total).toBe(194);
      });

      it('should not allow the discount to persist when a user removes an item from their cart that invalidates the voucher', function() {
        scope.addItem(item1);
        scope.addItem(item2);
        scope.processDiscount('FIFTEEN');
        scope.removeItem(item1);
        expect(scope.discount).toBe(0);
        expect(scope.total).toBe(167);
      });

      it('should not allow the discount to persist when a user adds an item, applies a discount and then removes the item', function() {
        scope.addItem(item1);
        scope.processDiscount('FIVE');
        scope.removeItem(item1);
        expect(scope.discount).toBe(0);
        expect(scope.total).toBe(0);
      });

      it('should allow the discount to persist when a user removes an item from their cart that does not invalidate the voucher', function() {
        scope.addItem(item3);
        scope.addItem(item2);
        scope.processDiscount('FIFTEEN');
        scope.removeItem(item2);
        expect(scope.discount).toBe(15);
        expect(scope.total).toBe(85);
      });

      it('should not allow multiple discounts', function() {
        scope.addItem(item1);
        scope.processDiscount('FIVE');
        scope.processDiscount('FIVE');
        expect(scope.discount).toBe(5);
        expect(scope.total).toBe(37);
      });
    });

    describe('Error reporting', function() {

      it('should have no errors initially', function() {
        expect(scope.errors.length).toBe(0);
      });


      it('should contain an error when an invalid code is used', function() {
        scope.addItem(item1);
        scope.processDiscount('INVALID');
        expect(scope.errors[0]).toBe('Invalid code');
      });

      it('should contain an error when a user attempts to redeem more than one code', function() {
        scope.addItem(item1);
        scope.processDiscount('FIVE');
        scope.processDiscount('TEN');
        expect(scope.errors[0]).toBe('You have already redeemed a code');
      });
    });
  });
});
