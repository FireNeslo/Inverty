'use strict';
/**
 * @author Øystein Ø. Olsen
 * @name Inverty
 * @package Inverty
 **/
angular.module('InvertyApp')
  .factory('Inverty', ['intyModels', function (intyModels) {
    var Grid = intyModels.Grid,
        Rect = intyModels.Rect,
        Point = intyModels.Point;
    /**
     * @name Player
     * @Class Player
     * @namespace Inverty
     * @description Store and update player data.
     **/
    function playerClass() {
      /**
       * @name Inverty-Player
       * @constructor Player
       * @param {number} lives Set the number of lives a player should start with.
       * @param {number} step  Start step.
       * @param {number} level Start level.
       * @param {number} score Start score
       **/
      function Player(lives, step, level, score) {
        this.lives = lives || 3;
        this.step = step || 0;
        this.level = level || 1;
        this.score = score || 0;
        this.steps = [];
      }
      /**
       * @function
       * @memberOf Player
       * @param {Round} round results from last round
       **/
      Player.prototype.levelUp = function (round) {
        this.score += ( 100 * (round.steps / this.lives)  ) + (this.level * 100);
        this.level += 1;
        this.step = 0;
        this.clearSteps();
        round.next(this);
      };
      /**
       * @function
       * @memberOf Player
       * @return {bool} isDead true if player has no lives left.
       **/
      Player.prototype.isDead = function () {
        return this.lives < 1;
      };
      /**
       * @function
       * @memberOf Player
       * @description handle loss of life.
       * @return {bool} isDead true if player has no lives left.
       **/
      Player.prototype.lifeLost = function () {
        this.lives -= 1;
        return this.isDead();
      };
      /**
       * @function
       * @memberOf Player
       * @return {object} stats - player stats
       * @return {number} stats.score - player score
       * @return {number} stats.level - player level
       **/
      Player.prototype.stats = function() {
        return {
          score : this.score,
          level : this.level
        };
      };
      /**
       * @function
       * @memberOf Player
       * @description empties the steps array.
       **/
      Player.prototype.clearSteps = function() {
        this.steps.length = 0;
      };
      /**
       * @function
       * @memberOf Player
       * @param {Round} round current round
       * @param {Point} point point clicked
       * @param {function} report - effect to report back to controller or view
       * @return {bool} isDead
       **/
      Player.prototype.nextStep = function (round, point, report) {
        var _self = this;
        this.step += 1;
        this.steps.push(point);
        if (this.step >=  round.steps) {
          this.step = 0;
          var isDead = this.lifeLost();
          if(!isDead && !round.hasWon()) {
            report(function test(x,y) {
              return !round.test(x,y);
            }).then(function() {
              round.reset(_self.steps);
              _self.clearSteps();
            });
          } else {
            _self.clearSteps();
          }
          return isDead;
        } else {
          return false;
        }
      };
      return Player;
    }
    /**
     * @name Round
     * @Class Round
     * @namespace Inverty
     * @description Store and update player data.
     **/
    function roundClass() {
      /**
       * @name Inverty-Round
       * @constructor Round
       * @param {number} size grid start size
       * @param {number} steps  problem steps.
       **/
      function Round(size, steps) {
        this.size = size || 4;
        this.sreps = steps || 1;
        this.newRound(this.size, this.steps);
      }
      /**
       * @function
       * @memberOf Round
       * @param {number} size grid start size
       * @param {number} steps  problem steps.
       **/
      Round.prototype.newRound = function (size, steps) {
        this.size = size || 4;
        this.steps = steps || 1;
        this.solution = new Grid(this.size, this.size);
        this.problem = this.makeProblem(this.solution, this.steps);
      };
      /**
       * @function
       * @memberOf Round
       * @param {Grid} solution - grid to base problem on
       * @param {number} steps - number of steps for problem
       * @return {Grid} problem
       **/
      Round.prototype.makeProblem = function (solution, steps) {
        solution = solution || this.solution;
        steps = steps || 1;
        var problem = solution.copy();
        for (var i = 0; i < steps; i++) {
          var x = Math.floor(Math.random() * problem.width()),
            y = Math.floor(Math.random() * problem.height());
          problem.invert(Rect.rectFromPoint(x, y));
        }
        return problem;
      };
      /**
       * @function
       * @memberOf Round
       * @param {number} x - coordinate x
       * @param {number} y - coordinate y
       * @return {bool} isEqual - problem x y equal solution x y
       **/
      Round.prototype.test = function(x,y) {
        return this.problem.get(x,y) === this.solution.get(x,y);
      };
      /**
       * @function
       * @memberOf Round
       * @param {Point[]} points - points to reset
       * @param {Grid} grid - grid to reset
       **/
      Round.prototype.reset = function(points, grid) {
        grid = grid || this.problem;
        for (var i = points.length-1; i >= 0 ; i--) {
          var p = points[i];
          grid.invert(Rect.rectFromPoint(p.x, p.y));
        }
      };
      /**
       * @function
       * @memberOf Round
       * @return {bool} hasWon
       **/
      Round.prototype.hasWon = function () {
        return this.problem.equals(this.solution);
      };
      /**
       * @function
       * @memberOf Round
       * @param {Player} player - current player
       * @description Readies next round
       **/
      Round.prototype.next = function () {
        this.steps += 1;
        if ((this.steps) > (Math.floor(this.size / 6) + 2)) {
          this.size += 1;
          this.steps = 1;
        }
        this.newRound(this.size, this.steps);
      };
      return Round;
    }
    /**
     * @name Game
     * @Class Game
     * @namespace Inverty
     * @description Store and update player data.
     **/
    function gameClass() {
      var Round = roundClass();
      var Player = playerClass();
      /**
       * @name Inverty-Game
       * @constructor Game
       * @param {number} size grid start size
       * @param {number} steps  problem steps.
       * @param {Player} player - load Player
       * @param {Round} round - load Round.
       **/
      function Game(size, steps, player, round) {
        this.newGame(size, steps, player, round);
      }
      /**
       * @function
       * @memberOf Game
       * @param {number} size grid start size
       * @param {number} steps  problem steps.
       * @param {Player} player - load Player
       * @param {Round} round - load Round.
       **/
      Game.prototype.newGame = function (size, steps, select, player, round) {
        size = size || 4;
        steps = steps || 1;
        this.player = player || new Player();
        this.round = round || new Round(size, steps);
        this.select = select || new Point(3,3);
      };
      /**
       * @function
       * @memberOf Game
       * @return {bool} hasWon - test if game is won
       **/
      Game.prototype.hasWon = function () {
        return this.round.hasWon();
      };
      /**
       * @function
       * @memberOf Game
       * @param {Point} point - clicked point
       * @param {function} report - ui-reporting function.
       * @return {bool} isDead - is player dead
       **/
      Game.prototype.nextStep = function (point, report) {
        return this.player.nextStep(this.round, point, report);
      };
      /**
       * @function
       * @memberOf Game
       * @param {function} gameover - game over callback
       * @return {function} click - click handler expects point and ui-report function
       **/
      Game.prototype.play = function (gameover) {
        var _self = this;
        return function(p, report) {
          var range = Rect.rectFromPoint(
            p.x,
            p.y,
            _self.select.x,
            _self.select.y
          );
          _self.round.problem.invert(range);
          if (_self.hasWon()) {
            report(function test() {
              return true;
            },
              'success'
            ).then(function() {
                _self.player.levelUp(_self.round);
              });
          } else {
            if(_self.nextStep(p, report)) {
              if(gameover) {
                gameover(_self.player.stats());
              }
              _self.newGame();
            }
          }
        };
      };
      /**
       * @function
       * @memberOf Game
       * @return {function} getProblem - returns a get problem function
       **/
      Game.prototype.problem = function () {
        var _self = this;
        return function() {
          return _self.round.problem;
        };
      };
      /**
       * @function
       * @memberOf Game
       * @return {function} getSolution - returns get solution function
       **/
      Game.prototype.solution = function () {
        var _self = this;
        return function() {
          return _self.round.solution;
        };
      };
      /**
       * @function
       * @memberOf Game
       * @return {function} getStats - getStats function
       **/
      Game.prototype.stats = function () {
        var _self = this;
        return function() {
          return {
            level: _self.player.level,
            lives: _self.player.lives,
            steps: _self.round.steps
          };
        };
      };
      return Game;
    }

    return gameClass();
  }]);
