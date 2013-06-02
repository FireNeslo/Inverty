'use strict';

angular.module('InvertyApp')
  .controller('GameCtrl', ['$scope', '$location', 'Inverty', 'highscore', function ($scope, $location, Inverty,highscore) {
    var inverty = new Inverty();
    $scope.stats =  inverty.stats();
    $scope.problem = inverty.problem();
    $scope.solution = inverty.solution();
    $scope.click = inverty.play(function gameover(score) {
      highscore.score(score);
      $location.path('/game_over');
    });
    $scope.report = function() {};
  }]);
