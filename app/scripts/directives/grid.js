'use strict';
angular.module('pixledApp')
  .directive('grid', function () {
    return {
      restrict: 'A',
      link: function(scope, element){
        var
          context = element[0].getContext('2d'),
          bw = element.width(),
          bh = element.height();


        //draw pixel boxes on canvas
        function drawGrid(){
          for (var xx1 = 0; xx1 <= bw; xx1 += pixled.pixel_size) {
            context.moveTo(0.5 + xx1, 0);
            context.lineTo(0.5 + xx1, bh + 0);
          }
          for (var x = 0; x <= bh; x += pixled.pixel_size) {
            context.moveTo(0, 0.5 + x);
            context.lineTo(bw, 0.5 + x);
          }
          context.lineWidth='0.75';
          context.strokeStyle = '#111';
          context.stroke();
        }
        drawGrid();
      }
    }; //fin return
  });
