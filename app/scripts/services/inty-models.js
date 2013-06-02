'use strict';

angular.module('InvertyApp')
  .factory('intyModels', function () {
    /**
     * @name Point
     * @Class Point
     * @namespace Inverty
     * @description Store and update player data.
     **/
    /**
     * @name Inverty-Point
     * @constructor Point
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate.
     **/
    function Point(x, y){
      this.x = x || 0;
      this.y = y || 0;
    }
    /**
     * @memberOf Point
     * @type {number}
     * @description x coordinate
     **/
    Point.prototype.x = null;
    /**
     * @memberOf Point
     * @type {number}
     * @description y coordinate
     **/
    Point.prototype.y = null;
    Point.prototype.add = function(v){
      return new Point(this.x + v.x, this.y + v.y);
    };
    Point.prototype.clone = function(){
      return new Point(this.x, this.y);
    };
    Point.prototype.degreesTo = function(v){
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      var angle = Math.atan2(dy, dx); // radians
      return angle * (180 / Math.PI); // degrees
    };
    Point.prototype.distance = function(v){
      var x = this.x - v.x;
      var y = this.y - v.y;
      return Math.sqrt(x * x + y * y);
    };
    Point.prototype.equals = function(toCompare){
      return this.x === toCompare.x && this.y === toCompare.y;
    };
    Point.prototype.interpolate = function(v, f){
      return new Point((this.x + v.x) * f, (this.y + v.y) * f);
    };
    Point.prototype.length = function(){
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Point.prototype.normalize = function(thickness){
      var l = this.length();
      this.x = this.x / l * thickness;
      this.y = this.y / l * thickness;
    };
    Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees){
      var radians = degrees * (Math.PI / 180);
      this.x = origin.x + arcWidth * Math.cos(radians);
      this.y = origin.y + arcHeight * Math.sin(radians);
    };
    Point.prototype.offset = function(dx, dy){
      this.x += dx;
      this.y += dy;
    };
    Point.prototype.subtract = function(v){
      return new Point(this.x - v.x, this.y - v.y);
    };
    Point.prototype.toString = function(){
      return '(x=' + this.x + ', y=' + this.y + ')';
    };

    Point.interpolate = function(pt1, pt2, f){
      return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
    };
    Point.polar = function(len, angle){
      return new Point(len * Math.sin(angle), len * Math.cos(angle));
    };
    Point.distance = function(pt1, pt2){
      var x = pt1.x - pt2.x;
      var y = pt1.y - pt2.y;
      return Math.sqrt(x * x + y * y);
    };
    /**
     * @name Rect
     * @Class Rect
     * @namespace Inverty
     **/
    /**
     * @name Inverty-Rect
     * @constructor Rect
     * @param {number} xmin - start x
     * @param {number} xmax - end x.
     * @param {number} ymin - start y
     * @param {number} ymax - end y.
     **/
    /**
     * @name Inverty-Rect
     * @constructor Rect
     * @param {Rect} rect - new rect from rect
     **/
    function Rect(xmin, xmax, ymin, ymax) {
      if (angular.isNumber(xmin)) {
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
      } else {
        this.xmin = xmin.xmin;
        this.xmax = xmin.xmax;
        this.ymin = xmin.ymin;
        this.ymax = xmin.ymax;
      }
    }
    /**
     * @function
     * @memberOf Rect
     * @return {int} height - Rect height
     **/
    Rect.prototype.height = function () {
      return this.ymax - this.ymin;
    };
    /**
     * @function
     * @static
     * @memberOf Rect
     * @param {number} x - center x
     * @param {number} y - center y
     * @param {number} w - width
     * @param {number} h - height
     * @return {Rect} rect - rect from point
     **/
    Rect.rectFromPoint = function(x,y,w,h) {
      var rx = w || 3,
      ry = h || 3,
      xmin = x - Math.floor(rx/2),
      xmax = xmin + rx,
      ymin = y - Math.floor(ry/2),
      ymax = ymin + ry;
      return new Rect(xmin,xmax,ymin,ymax);
    };
    /**
     * @function
     * @memberOf Rect
     * @return {int} width - Rect width
     **/
    Rect.prototype.width = function () {
      return this.xmax - this.xmin;
    };
    /**
     * @function
     * @memberOf Rect
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @return {bool} isInside - is inside rect
     **/
    Rect.prototype.hitTest = function (x, y) {
      return x >= this.xmin && x < this.xmax && y >= this.ymin && y < this.ymax;
    };
    /**
     * @name Grid
     * @Class Grid
     * @namespace Inverty
     **/
    /**
     * @name Inverty-Grid
     * @constructor Grid
     * @param {number} w - width
     * @param {number} h - height
     **/
    /**
     * @name Inverty-Grid
     * @constructor Grid
     * @param {bool[]} array table to use
     **/
    function Grid(w, h) {
      this.props = [];
      this.getRange = function getRange(t) {
        if (!t) {
          throw new Error('No table error.');
        }
        if (!t[0]) {
          throw new Error('Dimension error.');
        }
        return new Rect(0, t[0].length, 0, t.length);
      };

      if (angular.isNumber(w)) {
        this.generate(w, h);
      } else if (angular.isArray(w)) {
        this.table = w;
      }
      this.range = this.getRange(this.table);
    }
    /**
     * @function
     * @memberOf Grid
     * @param {number} w - width
     * @param {number} h - height
     **/
    Grid.prototype.generate = function (w, h) {
      this.table =  new Array(h);
      for (var i = 0; i < h; i++) {
        this.table[i] = new Array(h);
        for (var j = 0; j < w; j++) {
          this.table[i][j] = !!Math.floor(Math.random()*2);
        }
      }
      this.range = this.getRange(this.table);
    };
    /**
     * @function
     * @memberOf Grid
     * @return {Grid} copy - deep copy of grid
     **/
    Grid.prototype.copy = function () {
      var table = new Array(this.height());
      for (var i = 0; i < this.table.length; i++) {
        table[i] = angular.copy(this.table[i]);
      }
      return new Grid(table);
    };
    /**
     * @function
     * @memberOf Grid
     * @param {Grid} grid - grid to test
     * @return {bool} isEqual - true if same table values
     **/
    Grid.prototype.equals = function (grid) {
      var eq = true;
      var _self = this;
      this.forRange(this.range, function (x, y) {
        if (_self.get(x, y) !== grid.get(x, y)) {
          eq = false;
        }
      });
      return eq;
    };
    /**
     * @function
     * @memberOf Grid
     * @return {number} width - Grid width
     **/
    Grid.prototype.width = function () {
      return this.range.width();
    };
    /**
     * @function
     * @memberOf Grid
     * @return {number} height - Grid width
     **/
    Grid.prototype.height = function () {
      return this.range.height();
    };
    /**
     * @function
     * @memberOf Grid
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @return {bool} isInside - is inside rect
     **/
    Grid.prototype.hitTest = function (x, y) {
      return this.range.hitTest(x, y);
    };
    /**
     * @function
     * @memberOf Grid
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @return {bool} value
     **/
    Grid.prototype.get = function (x, y) {
      if (this.hitTest(x, y)) {
        return this.table[y][x];
      } else {
        return false;
      }
    };
    /**
     * @function
     * @memberOf Grid
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     * @param {bool} val - value
     **/
    Grid.prototype.set = function (x, y, val) {
      if (this.hitTest(x, y)) {
        this.table[y][x] = val;
        return true;
      }
      return false;
    };
    /**
     * @function
     * @memberOf Grid
     * @param {Rect} range - part of grid to iterate
     * @param {function} callback - iteration callback
     **/
    Grid.prototype.forRange = function (range, cb) {
      for (var y = range.ymin; y < range.ymax; y++) {
        for (var x = range.xmin; x < range.xmax; x++) {
          cb(x, y, this.get(x, y));
        }
      }
    };
    /**
     * @function
     * @memberOf Grid
     * @param {Rect} range - range to invert
     **/
    Grid.prototype.invert = function (range) {
      range = range || this.range;
      var _self = this;
      this.forRange(range, function (x, y, b) {
        _self.set(x, y, !b);
      });
    };
    Grid.prototype.setProp = function (x, y, name, value) {
      this.props[y] = this.props[y] || [];
      this.props[y][x] = this.props[y][x] || {};
      this.props[y][x][name] = value;
    };
    Grid.prototype.getProps = function (x, y) {
      if (this.props[y] && this.props[y][x]) {
        return this.props[y][x];
      } else {
        this.props[y][x] = {};
        return this.props[y][x];
      }
    };
    Grid.prototype.getProp = function (x, y, name) {
      return this.getProps(x, y)[name];
    };
    return {
      Grid: Grid,
      Rect: Rect,
      Point: Point
    };
  });
