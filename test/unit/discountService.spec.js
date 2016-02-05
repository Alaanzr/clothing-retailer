describe('Discount', function() {

  beforeEach(module('retailerApp'));

  it('checks for the existence of the Discount factory', inject(function(Discount) {
    expect(Discount).toBeDefined();
  }));
});
