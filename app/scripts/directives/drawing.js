'use strict';

angular.module('matrixApp')
  .directive('drawing', function (coordenadasService, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element){

        /*element.attr('width', (pixled.pixel_size * pixled.width)+1);
        element.attr('height', (pixled.pixel_size * pixled.height)+1);*/

        coordenadasService.on('child_added',function(data){
          $timeout(function(){
            drawPixel(data);
          },0);
        });
        coordenadasService.on('child_changed',function(data){
          $timeout(function(){
            drawPixel(data);
          },0);
        });
        coordenadasService.on('child_removed',function(data){
          $timeout(function(){
            clearPixel(data);
          },0);
        });
        var canvas = element[0].getContext('2d');        
        // variable that decides if something should be drawn on mousemove
        var drawing = false;
        // the last coordinates before the current move
        var pixSize = pixled.pixel_size, lastPoint = null/*, mouseDown = 0*/;
        var bw = pixled.pixel_size * pixled.width;
        var bh = pixled.pixel_size * pixled.height;
        //$parsedding around grid
        var p = 0;

        element.bind('touchmove', function(event){
          event.preventDefault();
          drawGrid();
          drawing = true;
          draw(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
        });

        element.bind('touchend', function(event){
          drawGrid();
          lastPoint = null;
          drawing = false;
        });

        element.bind('touchcancel', function(event){
          drawGrid();
          lastPoint = null;
          drawing = false;
        });

        element.bind('mousedown', function(){
          drawGrid();
          drawing = true;
        });

        element.bind('mousemove', function(event){
          drawGrid();
          if(drawing){
            draw(event.pageX, event.pageY)
          }
        });

        element.bind('mouseleave', function(event){
          drawGrid();
          if(drawing){
            lastPoint = null;
            drawing = false;
          }
        });

        element.bind('mouseup', function(event){
          // stop drawing
          drawGrid();
          if(drawing){
            draw(event.pageX, event.pageY)
          }        
          lastPoint = null;
          drawing = false;
        });
        
        var draw = function(pageX, pageY) {
          var canvas = angular.element('#canvas');
          var offset = offsetAngular(canvas);
          var x1 = Math.floor(((pageX - offset.left) - 1)  / pixSize);
          var y1 = Math.floor(((pageY - offset.top) - 1) / pixSize);
          var x0 = (lastPoint === null) ? x1 : lastPoint[0];
          var y0 = (lastPoint === null) ? y1 : lastPoint[1];
          var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
          var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
          while (true) {
            //write the pixel into Firebase, or if we are drawing white, remove the pixel

            var color =
            coordenadasService.addCoordenada(x0 + ':' + y0, scope.elcolor.replace('#',''));
            if (x0 === x1 && y0 === y1){
              break;
            }
            var e2 = 2 * err;
            if (e2 > -dy) {
              err = err - dy;
              x0 = x0 + sx;
            }
            if (e2 < dx) {
              err = err + dx;
              y0 = y0 + sy;
            }
          }
          lastPoint = [x1, y1];
        };

        // canvas reset
        // function reset(){
        //   element[0].width = element[0].width;
        // }
        function offsetAngular(elm) {
          try {return elm.offset();} catch(e) {}
          var rawDom = elm[0];
          var _x = 0;
          var _y = 0;
          var body = document.documentElement || document.body;
          var scrollX = window.pageXOffset || body.scrollLeft;
          var scrollY = window.pageYOffset || body.scrollTop;
          _x = rawDom.getBoundingClientRect().left + scrollX;
          _y = rawDom.getBoundingClientRect().top + scrollY;
          return { left: _x, top:_y };
        }

        //draw pixel boxes on canvas
        function drawGrid(){
          for (var xx1 = 0; xx1 <= bw; xx1 += pixled.pixel_size) {
            canvas.moveTo(0.5 + xx1 + p, p);
            canvas.lineTo(0.5 + xx1 + p, bh + p);
          }

          for (var x = 0; x <= bh; x += pixled.pixel_size) {
            canvas.moveTo(p, 0.5 + x + p);
            canvas.lineTo(bw + p, 0.5 + x + p);
          }
          canvas.lineWidth='2';
          canvas.strokeStyle = '#222';
          canvas.stroke();
        }


        var drawPixel = function(snapshot) {
          var coords = snapshot.name().split(':');
          canvas.fillStyle = '#'+snapshot.val();
          canvas.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
          //drawGrid();
        };
        
        var clearPixel = function(snapshot) {
          var coords = snapshot.name().split(':');
          canvas.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
          drawGrid();
        };

      }
    }; //fin return
  });
