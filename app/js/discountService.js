retailerApp.factory('Discount', function() {

  var discountFactory = {};

  discountFactory.reviewCartCategories = function(categories) {
    var args = Array.prototype.slice.call(arguments, 1);
    return categories.some(function(elm) {
      return args.indexOf(elm) !== -1;
    });
  }

  discountFactory.discountInfo = function(total, categories) {
    return {
      'FIVE': {
        condition: total > 5,
        discount: 5
      },
      'TEN': {
        condition: total > 50,
        discount: 10
      },
      'FIFTEEN': {
        condition: total > 75 && this.reviewCartCategories(categories, 'Men\'s Footwear', 'Women\'s Footwear'),
        discount: 15
      }
    };
  };

  return discountFactory;
});
