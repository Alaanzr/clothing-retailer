describe('Retailer App', function() {

  var itemList = element.all(by.repeater('item in items'));
  var cartItems = element.all(by.repeater('item in cart'));
  var total = element(by.binding('total.toFixed(2)'));
  var addToBasket = element.all(by.buttonText('Add to basket')).first();
  var removeFromCart = element.all(by.buttonText('Remove from cart')).first();
  var redeemVoucher = element(by.buttonText('Redeem Voucher'));
  var discountCode = element(by.model('discountCode'));
  var error = element(by.repeater('error in errors').row(0));

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

    describe('Applying discounts', function() {

      beforeEach(function() {
        addToBasket.click();
      });

      it('should apply a £5 discount', function() {
        discountCode.sendKeys('FIVE');
        redeemVoucher.click();
        expect(total.getText()).toBe('£94.00');
      });

      it('should apply a £10 discount', function() {
        discountCode.sendKeys('TEN');
        redeemVoucher.click();
        expect(total.getText()).toBe('£89.00');
      });

      it('should apply a £15 discount', function() {
        discountCode.sendKeys('FIFTEEN');
        redeemVoucher.click();
        expect(total.getText()).toBe('£84.00');
      });

      it('should raise an error when an invalid code is used', function() {
        discountCode.sendKeys('INVALID');
        redeemVoucher.click();
        expect(error.getText()).toBe('Invalid code');
      });

      it('should raise an error when multiple valid codes are used', function() {
        discountCode.sendKeys('FIVE');
        redeemVoucher.click();
        discountCode.sendKeys('TEN');
        expect(error.getText()).toBe('You have already redeemed a code');
      });

    });

    describe('Adding/removing items to and from the cart', function() {

      beforeEach(function() {
        addToBasket.click();
      });

      it('should show the item in the cart', function() {
        cartItems.then(function(items) {
          expect(items.length).toBe(1);
        });
      });

      it('should remove an item from the cart', function() {
        removeFromCart.click();
        cartItems.then(function(items) {
          expect(items.length).toBe(0);
        });
      });
    });
  });
});
