'use strict';

angular.module('InvertyApp')
  .controller('GameOverCtrl', ['$scope', '$location', 'highscore', function ($scope, $location, highscore) {
  $scope.confirm = function () {
    highscore.save($scope.player);
    $location.path('high_score');
  };
}]);