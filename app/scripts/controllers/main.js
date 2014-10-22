/*global $:false */
'use strict';

angular.module('matrixApp')
  .controller('MainCtrl', function ($scope, coordenadasService) {
    $scope.movida = '';
    $scope.colors = ['fff','000','f00','0f0','00f','777','f8d','f05','f80','0f8','FFFF00','08f','408','8ff'];
    $scope.elcolor = '000';
    $scope.listaNombres = [];
    $scope.canvasWidth = (matrixdrawing.width * matrixdrawing.pixel_size) + 1;
    $scope.canvasHeight = (matrixdrawing.height * matrixdrawing.pixel_size) + 1;


    $scope.$on('$viewContentLoaded', function() {
        $(".pick-a-color").pickAColor({showHexInput:false, inlineDropdown: true});
        $(".color-dropdown.no-hex").append('<span class="glyphicon glyphicon-tint"></span>');
    })

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
      coordenadasService.sustituirPreset($scope.preset);
    };
  });
