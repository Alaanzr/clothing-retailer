describe('Retailer App', function() {

  var itemList = element.all(by.repeater('item in items'));
  var total = element(by.binding('total.toFixed(2)'));
  var addToBasket = element.all(by.buttonText('Add to basket')).first();
  var redeemVoucher = element.all(by.buttonText('Redeem Voucher'));
  var discountCode = element(by.model('discountCode'));

  function retrieveData(type) {
    return element.all(by.repeater('item in items').column('item.' + type)).then(function(item) {
      return item[0].getText();
    });
  };

  describe('MainCtrl', function() {

    beforeEach(function() {
      browser.get('app/index.html');
      browser.waitForAngular();
    });

    it('should display the correct title', function() {
      expect(browser.getTitle()).toBe('Clothing Retailer');
    });

    it('should display the correct number of items', function() {
      expect(itemList.count()).toBe(13);
    });

    it('should display the correct product name', function() {
      expect(retrieveData('productName')).toEqual('Almond Toe Court Shoes, Patent Black');
    });

    it('should display the correct price', function() {
      expect(retrieveData('price')).toEqual('£99.00');
    })

    it('should display the correct category', function() {
      expect(retrieveData('category')).toEqual('Women\'s Footwear');
    })

    it('should display the correct quantity', function() {
      expect(retrieveData('quantityInStock')).toEqual('5');
    })

    it('should show a total of £0.00 initially', function() {
      expect(total.getText()).toBe('£0.00');
    });

    it('should show a total of £99.00 after adding the first product to the cart', function() {
      addToBasket.click();
      expect(total.getText()).toBe('£99.00');
    });

    it('should apply a £5 discount', function() {
      addToBasket.click();
      discountCode.sendKeys('FIVE');
      redeemVoucher.click();
      expect(total.getText()).toBe('£94.00');
    });

  });

});
