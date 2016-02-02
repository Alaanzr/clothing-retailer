describe('ItemCtrl', function() {

  var scope, ctrl, $httpBackend;

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
    $httpBackend.expectGET('items/items.json').respond([
      {productName: 'Suede Shoes, Blue', category: 'Women\'s Footwear'}
    ]);
    scope = $rootScope.$new();
    ctrl = $controller('ItemCtrl', {$scope:scope});
  }));

  it('should not contain item data prior to calling the Item Service', function() {
    expect(scope.items).toEqualData([]);
  });

  it('should contain item data after calling the Item Service', function() {
    $httpBackend.flush();
    expect(scope.items).toEqualData([
      {productName: 'Suede Shoes, Blue', category: 'Women\'s Footwear'}
    ])
  });
});
