'use strict';

angular.module('InvertyApp')
  .controller('HighScoreCtrl', ['$scope', 'highscore',function($scope,highscore) {
	$scope.table = highscore.table;
}]);
