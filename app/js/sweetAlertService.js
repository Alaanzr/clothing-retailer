(function() {
  'use strict';

  angular.module('retailerApp').factory('SweetAlert', ['$window', function($window) {

    var alertFactory = {};

    alertFactory.saError = function(errors) {
      $window.swal({
        title: 'Unable to redeem voucher',
        text: errors.length + ' error(s) :\n' + errors.join('\n'),
        type: 'error'
      });
    };

    alertFactory.saSuccess = function(discount) {
      $window.swal({
        title: 'Voucher successfully redeemed',
        text: '£' + discount + ' discount applied',
        type: 'success'
      });
    };

    return alertFactory;

  }]);
})();
