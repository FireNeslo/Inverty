'use strict';

angular.module('InvertyApp')
  .directive('intyBoard', ['$q', '$timeout', 'intyModels', function ($q, $timeout, intyModels) {
    return {
      template: '<div style="height:{{height}}px" class="{{wrapperClass}} inty-panel-wrapper"><div class="inty-panel"><ul ng-repeat="(y,bools) in grid.table" class="unstyled"><li style="width:{{colWidth}}%; height:{{height/(100/colHeight)}}px" ng-repeat="(x,b) in bools" ng-click="click(x,y)" ng-mouseleave="hover(x,y, false)" ng-mouseover="hover(x,y, true)" class="pull-left tile tile-{{b}}"><div class="tile-inner t-{{x}}-{{y}}"></div></li></ul><div class="clearfix"></div></div></div>',
      restrict: 'E',
      replace: true,
      scope: {
        grid: '=',
        disableInvert: '@',
        onClick: '=',
        highlight: '=',
        wrapperClass : '@'
      },
      link: function postLink(scope, element) {
        /* Models and tools*/
        var $ = window.jQuery,
          Grid = intyModels.Grid,
          Rect = intyModels.Rect,
          Point = intyModels.Point,
          invert = true;
        /* Watchers */

        scope.wrapperClass = scope.wrapperClass || 'span6';
        scope.width = function () {
          return $(element).width() * 0.95;
        };
        scope.$watch(scope.width, function (width) {
          scope.height = width;
        });
        window.resize = function () {
          scope.$apply();
        };
        scope.$watch('disableInvert', function (disable) {
          invert = disable !== 'true';
        });
        scope.$watch('grid', function (grid) {
          if (angular.isArray(grid)) {
            scope.grid = new Grid(grid);
            grid = scope.grid;
          }
          scope.colWidth = Math.floor(100 / grid.width());
          scope.colHeight = Math.floor(100 / grid.height());
        });

        /*Click event */
        scope.click = function (x, y) {
          if (scope.onClick) {
            scope.onClick(new Point(x, y), report());
          }
        };

        /* Hover events */
        var selected = [];

        function hover(x, y) {
          var i = 0;
          scope.grid.forRange(Rect.rectFromPoint(x, y), function (x, y) {
            var el = $(element).find('.t-' + x + '-' + y)[0];
            if (el) {
              el.classList.add('highlight');
            }
            selected[i] = el;
            i += 1;
          });
        }

        function unhover() {
          for (var i = 0; i < selected.length; i++) {
            var el = selected[i];
            if (el) {
              el.classList.remove('highlight');
            }
          }
        }

        scope.hover = function (x, y, h) {
          if (invert) {
            if (h) {
              hover(x, y);
            } else {
              unhover();
            }
          }
        };
        function report() {
          return function (test, reportclass, duration, times) {
            reportclass = reportclass || 'badness';
            times = times || 2;
            duration = (duration || 1000) / times;
            var defer = $q.defer();
            var elements = [];

            function blinkOn() {
              var i = 0;
              scope.grid.forRange(scope.grid.range, function (x, y) {
                elements[i] = $(element).find('.t-' + x + '-' + y)[0];
                if (elements[i]) {
                  if (!test || (test && test(x, y))) {
                    elements[i].classList.add(reportclass);
                  }
                }
                i += 1;
              });
              $timeout(blinkOff, duration);
            }

            function blinkOff() {
              angular.forEach(elements, function (el, i) {
                if (elements[i]) {
                  el.classList.remove(reportclass);
                }
              });
              if (times > 0) {
                times -= 1;
                $timeout(blinkOn, duration);
              } else {
                scope.$apply(function () {
                  defer.resolve(true);
                });
              }
            }

            blinkOn();
            return defer.promise;
          };
        }
      }
    };
  }]);
