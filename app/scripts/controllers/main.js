/*global $:false */
'use strict';
angular.module('pixledApp')
  .controller('MainCtrl', function ($scope, coordenadasService) {
    $scope.movida = '';
    $scope.elcolor = 'fff';
    $scope.listaNombres = [];
    $scope.canvasWidth = (pixled.width * pixled.pixel_size) + 1;
    $scope.canvasHeight = (pixled.height * pixled.pixel_size) + 1;

    $scope.$on('$viewContentLoaded', function() {

    });

    $scope.borrar = function(){
      coordenadasService.borrar();
    };
    $scope.rellenar = function(){
      coordenadasService.rellenar();
    };
    $scope.guardarDibujo = function(){
      coordenadasService.copyFbRecord($scope.nombreDibujo);
      $('#configuracion').modal('hide');
      $scope.movida = coordenadasService.pillarPresets();
      $scope.movida.then(function(snap){
        snap.forEach(function(data){
          $scope.listaNombres.push(data.name());
        });
      });
    };
    $scope.movida = coordenadasService.pillarPresets();
    $scope.movida.then(function(snap){
      snap.forEach(function(data){
        $scope.listaNombres.push(data.name());
      });
    });
    $scope.seleccionPreset = function(){
      $('#settings').modal('hide')
      coordenadasService.sustituirPreset($scope.preset);
    };

    angular.element(document).ready(function () {
        $('.toolbar').find('a').click(function(e){
            e.preventDefault();
        });
        $('#modal-config').click(function(e){
          e.preventDefault();
          $('#settings').modal();
        });

      var canvas = {};

      function resizeCanvas(block){
        var w = block.parent().width() * .8;
        block.attr('width', w);
        block.attr('height', w);
      }

        canvas = $('#canvas');
        resizeCanvas(canvas);


      $(window).resize(function() {
        resizeCanvas(canvas);
        console.log(canvas.length);
      });


    });

  });
