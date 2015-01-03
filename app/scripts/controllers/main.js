/*global $:false */
'use strict';
angular.module('pixledApp')
  .controller('MainCtrl', function ($scope, coordenadasService) {
    $scope.movida = '';
    $scope.elcolor = 'fff';
    $scope.listaNombres = [];
    $scope.canvasWidth = 1;
    $scope.canvasHeight = 1;
    $scope.tool = '';

//    $scope.$on('$viewContentLoaded', $scope.init);
    $scope.pencil = function(){
      $('#canvasdraw').css('cursor', 'url(/img/tools/pen-24.png) 0 23, auto');
      $scope.tool = 'pencil';
    };
    $scope.pencil();
    $scope.eraser = function(){
      $('#canvasdraw').css('cursor', 'url(/img/tools/eraser-24.png) 0 23, auto');
      $scope.tool = 'eraser';
    };


    $scope.borrar = function(){
      coordenadasService.borrar();
    };
    $scope.rellenar = function(){
      coordenadasService.rellenar();
    };
    $scope.guardarDibujo = function(){
      coordenadasService.copyFbRecord($scope.nombreDibujo);
      $('#configuracion').modal('hide');
      $scope.movida = coordenadasService.getPresets();
      $scope.movida.then(function(snap){
        snap.forEach(function(data){
          $scope.listaNombres.push(data.name());
        });
      });
    };
    $scope.movida = coordenadasService.getPresets();
    $scope.movida.then(function(snap){
      snap.forEach(function(data){
        $scope.listaNombres.push(data.name());
      });
    });
    $scope.seleccionPreset = function(){
      $('#settings').modal('hide');
      coordenadasService.setPreset($scope.preset);
    };

    angular.element(document).ready(function () {
      $('.toolbar').find('a').click(function(e){
          e.preventDefault();
      });
      $('#modal-config').click(function(e){
        e.preventDefault();
        $('#settings').modal();
      });

      /**
       * Resize canvas on window resizing
       * @param canvas
       */
      function resizeCanvas(canvas){
        if(canvas.length == 0) return;
        // stage dimensions
        var canvasWidth = canvas.width(), // your stage width
        canvasHeight = canvas.height(), // your stage height
        parentWidth = canvas.parent().width(),
        parentHEight = canvas.parent().width();

        var scale = {x: 1, y: 1};
        scale.x = (parentWidth - 50) / canvas.width();
        scale.y = (parentHEight - 50) / canvas.height();

        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        var context = canvas[0].getContext("2d");
        context.imageSmoothingEnabled = false;
        context.scale(scale.x -.04, scale.y-.04);
        //canvas.css('width', canvas.parent().width());
      canvas.css('max-width', $(window).height() - 130);
      }

      resizeCanvas($('#canvasdraw'));
      $(window).resize(function() {
        resizeCanvas($('#canvasdraw'));
      });
    });
  });
