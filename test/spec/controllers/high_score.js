'use strict';

describe('Controller: HighScoreCtrl', function() {

  // load the controller's module
  beforeEach(module('InvertyApp'));

  var HighScoreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    HighScoreCtrl = $controller('HighScoreCtrl', {
      $scope: scope
    });
  }));
});
