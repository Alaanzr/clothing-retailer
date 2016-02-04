describe('Retailer App', function() {

  var itemList = element.all(by.repeater('item in items'));

  function retrieveData(type) {
    return element.all(by.repeater('item in items').column('item.' + type)).then(function(item) {
      return item[0].getText();
    });
  };

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

});
