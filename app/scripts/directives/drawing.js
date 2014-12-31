'use strict';

angular.module('pixledApp')
  .directive('drawing', function (
    coordenadasService, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element){
        coordenadasService.on('child_added',function(data){
          $timeout(function(){
            drawPixelFromService(data);
          },0);
        });
        coordenadasService.on('child_changed',function(data){
          $timeout(function(){
            drawPixelFromService(data);
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
        var pixSize = 20,
        bw = element.width(),
        bh = element.height(),
        lastPoint = null;

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
          var canvas = angular.element('#canvasdraw');
          var offset = offsetAngular(canvas);
          var cw = canvas.width() / pixled.pixels_x;
          var ch = canvas.height() / pixled.pixels_y;
          var x1 = Math.floor(((pageX - offset.left) - 1)  / cw);
          var y1 = Math.floor(((pageY - offset.top) - 1) / ch);
          var x0 = (lastPoint === null) ? x1 : lastPoint[0];
          var y0 = (lastPoint === null) ? y1 : lastPoint[1];
          var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
          var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;

          drawPixel(x0, y0, scope.elcolor);
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
          try {
            return elm.offset();} catch(e) {}
          var rawDom = elm[0];
          var _x = 0;
          var _y = 0;
          var body = document.documentElement || document.body;
          var scrollX = window.pageXOffset || body.scrollLeft;
          var scrollY = window.pageYOffset || body.scrollTop;
          _x = rawDom.getBoundingClientRect().left + scrollX;
          _y = rawDom.getBoundingClientRect().top + scrollY;
          console.log({ left: _x, top:_y });
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
          canvas.lineWidth='1';
          canvas.strokeStyle = '#000';
          canvas.stroke();
        }


        var drawPixelFromService = function(snapshot) {
          var coords = snapshot.name().split(':');
          canvas.fillStyle = '#'+snapshot.val();
          canvas.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
          drawPixel(coords[0], coords[1], '#'+snapshot.val());

          //drawGrid();
        };
        var drawPixel = function(x,y,color) {
          //canvas.fillStyle = color;
          //canvas.fillRect(parseInt(x) * pixSize, parseInt(y) * pixSize, pixSize, pixSize);

          var imgData=canvas.createImageData(20,20);
          for (var i=0;i<imgData.data.length;i+=4)
            {
            imgData.data[i+0]=255;
            imgData.data[i+1]=0;
            imgData.data[i+2]=0;
            imgData.data[i+3]=255;
            }
          canvas.putImageData(imgData,parseInt(x) * 20 ,parseInt(y)*20);
          drawGrid();
        };

        
        var clearPixel = function(snapshot) {
          var coords = snapshot.name().split(':');
          canvas.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
          drawGrid();
        };


      }
    }; //fin return
  });
