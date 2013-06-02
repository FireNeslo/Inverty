'use strict';

angular.module('InvertyApp', [])
  .config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/high_score', {
      templateUrl: 'views/high_score.html',
      controller: 'HighScoreCtrl'
    })
    .when('/game_over', {
      templateUrl: 'views/game_over.html',
      controller: 'GameOverCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
