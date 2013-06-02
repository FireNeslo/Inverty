'use strict';

describe('Controller: GameCtrl', function() {

  // load the controller's module
  beforeEach(module('InvertyApp'));

  var GameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    GameCtrl = $controller('GameCtrl', {
      $scope: scope
    });
  }));
});
