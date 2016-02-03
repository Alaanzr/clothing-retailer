describe('ItemCtrl', function() {

  var scope, ctrl, $httpBackend;
  var item1 = {productName: 'Suede Shoes, Blue', category: 'Women\'s Footwear', price: 42.00, quantityInStock: 4}

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
    ctrl = $controller('ItemCtrl', {$scope:scope});
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
          item1 = {productName: 'Suede Shoes, Blue', category: 'Women\'s Footwear', price: 42.00, quantityInStock: 4}
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
            expect(item1.quantityInCart).toBe(0);
          });
        });
      });
    });
});
