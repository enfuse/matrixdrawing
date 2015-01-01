'use strict';
angular.module('pixledApp')
  .directive('grid', function (
    coordenadasService, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element){
        var canvas = element[0].getContext('2d');
        //var offset = offsetAngular(canvas);
        var cw = element.width() / pixled.pixels_x;
        var ch = element.height() / pixled.pixels_y;
//        var x1 = Math.floor(((pageX - offset.left) - 1)  / cw);
//        var y1 = Math.floor(((pageY - offset.top) - 1) / ch);
//        var x0 = (lastPoint === null) ? x1 : lastPoint[0];
//        var y0 = (lastPoint === null) ? y1 : lastPoint[1];
//        var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
//        var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
        var p = 0;
        // variable that decides if something should be drawn on mousemove
        var drawing = false;
        // the last coordinates before the current move
        var pixSize = 20,
          bw = element.width(),
          bh = element.height(),
          lastPoint = null;
        drawGrid();



        //draw pixel boxes on canvas
        function drawGrid(){
          console.log(canvas);
          for (var xx1 = 0; xx1 <= bw; xx1 += pixled.pixel_size) {
            canvas.moveTo(0.5 + xx1 + p, p);
            canvas.lineTo(0.5 + xx1 + p, bh + p);
          }
          for (var x = 0; x <= bh; x += pixled.pixel_size) {
            canvas.moveTo(p, 0.5 + x + p);
            canvas.lineTo(bw + p, 0.5 + x + p);
          }
          canvas.lineWidth='1';
          canvas.strokeStyle = '#000';
          canvas.stroke();
        }
      }
    }; //fin return
  });