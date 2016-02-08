describe('Item', function() {

  'use strict';

  beforeEach(module('retailerApp'));

  it('checks for the existence of the Item factory', inject(function(Item) {
    expect(Item).toBeDefined();
  }));
});
