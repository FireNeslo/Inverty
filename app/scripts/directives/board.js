'use strict';

angular.module('InvertyApp')
  .directive('board', ['intyModels', function (intyModels) {
    return {
      template: '<div style="width:{{width}}px;height:{{height}}px" class="span6">' +
        '<ul ng-repeat="(y,bools) in grid.table" class="unstyled">' +
        '<li style="width:{{colWidth}}px; height:{{colHeight}}px" ng-repeat="(x,b) in bools" ng-click="click(x,y)" ng-mouseleave="unhover(x,y)" ng-mouseover="hover(x,y)" class="pull-left tile tile-{{b}}">' +
        '<div class="tile-inner t-{{x}}-{{y}}"></div>' +
        '</li>' +
        '</ul>' +
        '</div>',
      restrict: 'E',
      replace: true,
      scope: {
        grid: '=',
        width: '@',
        height: '@',
        disableInvert: '@',
        select: '=',
        onInvert: '=',
        highlight: '='
      },
      link: function postLink(scope, element) {
        var $ = window.jQuery;
        var Grid = intyModels.Grid;
        var Rect = intyModels.Rect;
        var Point = intyModels.Point;
        var invert = true;
        scope.Grid = Grid;
        scope.$watch('disableInvert', function (disable) {
          invert = disable !== 'true';
        });
        scope.hover = function (x, y) {
          if (invert) {
            scope.grid.forRange(Rect.rectFromPoint(x, y), function (x, y) {
              $(element).find('.t-' + x + '-' + y).addClass('highlight');
            });
          }
        };
        function highlight(p) {
          var sx,
            sy;
          if (p) {
            sx = p.x,
            sy = p.y;
            scope.grid.forRange(Rect.rectFromPoint(sx, sy), function (x, y) {
              $(element).find('.t' + x + '-' + y).addClass('badness');
            });
            scope.last = p;
          } else {
            if (scope.last) {
              sx = scope.last.x,
              sy = scope.last.y;
              scope.grid.forRange(Rect.rectFromPoint(sx, sy), function () {
                $(element).find('.badness').removeClass('badness');
              });
            }
          }
        }
        scope.$watch('highlight', highlight);
        scope.unhover = function (x, y) {
          if (invert) {
            scope.grid.forRange(Rect.rectFromPoint(x, y), function () {
              $(element).find('.highlight').removeClass('highlight');
            });
          }
        };
        scope.$watch('width', function (w) {
          var h = parseInt(w, false);
          scope.colWidth = Math.floor(w / scope.grid.width());
          scope.colHeight = Math.floor(h / scope.grid.height());
        });
        scope.$watch('grid', function (grid) {
          var w = scope.width || scope.height || 600,
            h = scope.height || w;
          scope.width = w;
          scope.height = h;
          if (angular.isArray(grid)) {
            scope.grid = new Grid(grid);
            grid = scope.grid;
          }
          scope.colWidth = Math.floor(w / grid.width());
          scope.colHeight = Math.floor(h / grid.height());
        });
        scope.click = function (x, y) {
          if (invert) {
            scope.grid.invert(Rect.rectFromPoint(x, y));
            if (scope.onInvert) {
              scope.onInvert(new Point(x, y));
            }
          }

        };
      }
    };
  }]);