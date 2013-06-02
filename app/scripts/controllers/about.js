'use strict';

angular.module('InvertyApp')
  .controller('AboutCtrl', ['$scope', '$location', 'intyModels', function ($scope, $location, intyModels) {
    var Grid = intyModels.Grid;
    var Range = intyModels.Rect;
    $scope.grid = new Grid([
      [true, false, false, false],
      [false, true, true, false],
      [false, false, false, true],
      [false, false, false, true]
    ]);
    $scope.invert = function(p) {
      $scope.grid.invert(Range.rectFromPoint(p.x, p.y));
    };
    $scope.close = function() {
      $location.path('/');
    };
  }]);