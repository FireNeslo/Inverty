'use strict';

describe('Controller: GameOverCtrl', function() {

  // load the controller's module
  beforeEach(module('InvertyApp'));

  var GameOverCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    GameOverCtrl = $controller('GameOverCtrl', {
      $scope: scope
    });
  }));

});
