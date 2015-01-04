'use strict';

angular.module('pixledApp')
  .directive('drawing', function (coordenadasService, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element){
        var
          cTake = element.find('#canvas_take'),
          cDraw = element.find('#canvas_draw'),
          cGrid = element.find('#canvas_grid'),
          ctxTake = element[0].querySelector('#canvas_take').getContext('2d'),
          ctxGrid = element[0].querySelector('#canvas_grid').getContext('2d'),
          ctxDraw = element[0].querySelector('#canvas_draw').getContext('2d');

        var tools = {};

        var
          bw = cGrid.width(),
          bh = cGrid.height(),
          lastPoint = null,
          buffer = [pixled.pixels_x];

        for (var i=0; i <pixled.pixels_x; i++)
          buffer[i]=new Array(pixled.pixels_y)



        coordenadasService.on('child_added',function(data){
          $timeout(function(){
            drawPixelFromService(data);
          },0,false);
        });

        coordenadasService.on('child_changed',function(data){
          $timeout(function(){
            drawPixelFromService(data);
          },0,false);
        });

        coordenadasService.on('child_removed',function(data){
          $timeout(function(){
            reset(cDraw, ctxDraw);
          },100,false);
        });

        //Touch events
        cTake.on('touchmove', function(event){
          event.preventDefault();
          draw(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
        });

        cTake.on('touchend', function(event){
          lastPoint = null;
        });

        cTake.on('touchcancel', function(event){
          lastPoint = null;
        });

        //Mouse events
        cTake.on('mousedown', function(event){
          event.preventDefault();
          draw(event.pageX, event.pageY);
        });

        cTake.on('mouseup', function(event){
          lastPoint = null;
        });

        cTake.on('mousemove', function(event){
          event.preventDefault();
          if(event.which == 1){
            draw(event.pageX, event.pageY)
          }
          if (!Modernizr.touch) {
            shadow(event.pageX, event.pageY)
          }
        });

        cTake.on('mouseleave', function(event){
          if(!event.which != 1){
            lastPoint = null;
          }else{
            reset(cTake, ctxTake);
          }
        });

        cTake.on('mouseenter', function(event){
          if(event.which == 1){
            lastPoint = null;
          }
        });
        
        var draw = function(pageX, pageY) {
          //var canvas = angular.element('#canvas_draw');
          var offset = offsetAngular(cDraw);
          var cw = cDraw.width() / pixled.pixels_x;
          var ch = cDraw.height() / pixled.pixels_y;
          var x1 = Math.floor(((pageX - offset.left) - 1)  / cw);
          var y1 = Math.floor(((pageY - offset.top) - 1) / ch);

          //Stop if same pixel
          if(!(lastPoint === null) && (lastPoint[0] == x1 &&  lastPoint[1] == y1)) return;

          var x0 = (lastPoint === null) ? x1 : lastPoint[0];
          var y0 = (lastPoint === null) ? y1 : lastPoint[1];
          var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
          var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
          if(scope.tool == 'eraser')
            drawPixel(x0, y0, "#000000");
          else
            drawPixel(x0, y0, scope.elcolor);

          while (true) {
            //write the pixel into Firebase, or if we are drawing white, remove the pixel
            if(scope.tool == 'eraser')
              var color = coordenadasService.addCoordenada(x0 + ':' + y0,  "000000");
            else
              var color = coordenadasService.addCoordenada(x0 + ':' + y0, scope.elcolor.replace('#',''));

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
        function reset(canvas, ctx){
          ctx.clearRect(0, 0, canvas.width(), canvas.height());
        }

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
          return { left: _x, top:_y };
        }

        //draw pixel boxes on canvas
        function drawGrid(){
          for (var xx1 = 0; xx1 <= bw; xx1 += pixled.pixel_size) {
            ctxGrid.moveTo(0.5 + xx1, 0);
            ctxGrid.lineTo(0.5 + xx1, bh + 0);
          }
          for (var x = 0; x <= bh; x += pixled.pixel_size) {
            ctxGrid.moveTo(0, 0.5 + x);
            ctxGrid.lineTo(bw, 0.5 + x);
          }
          ctxGrid.lineWidth='0.75';
          ctxGrid.strokeStyle = '#111';
          ctxGrid.stroke();
        }
        drawGrid();


        var drawPixelFromService = function(snapshot) {
          var coords = snapshot.name().split(':');
          drawPixel(coords[0], coords[1], '#'+snapshot.val());
        };

        var drawPixel = function(x,y,color) {
          var imgData=ctxDraw.createImageData(20,20);
          var rgb = hexToRgb(color);
          if(!rgb) return; //if not correct color
          for (var i=0;i<imgData.data.length;i+=4){
            imgData.data[i+0]= rgb.r;
            imgData.data[i+1]= rgb.g;
            imgData.data[i+2]= rgb.b;
            imgData.data[i+3]=255;
          }
          ctxDraw.putImageData(imgData,parseInt(x) * 20 ,parseInt(y)*20);
          //buffer[x][y] = color;
        };

        var shadow = function(x,y) {
          reset(cTake, ctxTake);
          var offset = offsetAngular(cDraw);
          var cw = cTake.width() / pixled.pixels_x;
          var ch = cTake.height() / pixled.pixels_y;
          var x1 = Math.floor(((x - offset.left) - 1)  / cw);
          var y1 = Math.floor(((y - offset.top) - 1) / ch);



          var rgb = hexToRgb(scope.elcolor);
          var imgData=ctxTake.createImageData(20,20);
          for (var i=0;i<imgData.data.length;i+=4){
            imgData.data[i+0]= rgb.r;
            imgData.data[i+1]= rgb.g;
            imgData.data[i+2]= rgb.b;
            imgData.data[i+3]=255;
          }
          ctxTake.putImageData(imgData,parseInt(x1) * 20 ,parseInt(y1)*20);
          //buffer[x][y] = color;

        };
        
        /*var clearPixel = function(snapshot) {
          var coords = snapshot.name().split(':');
          canvas.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
          //drawGrid();
        };*/

        var hexToRgb = function(hex) {
          // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
          var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
          });

          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        }
      }
    }; //fin return
  });
