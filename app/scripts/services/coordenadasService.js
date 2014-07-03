/*global Firebase */
'use strict';

angular.module('matrixappCoordenas', [])
  .factory('coordenadasService', function ($q, $rootScope) {
    var deferred = $q.defer();
    var firebase = {};
    firebase = new Firebase(matrixdrawing.live_url);
    var presets = {};
    presets = new Firebase(matrixdrawing.artworks_url);
    return {
      base: firebase,
      on: function (eventName, callback){
        firebase.on(eventName, function(){
          var args = arguments;
          callback.apply(firebase, args);
        });
      },
      addCoordenada: function(coordenada, color){
        firebase.child(coordenada).set(color);
      },     
      borrar: function(){
        firebase.remove();
      },
      copyFbRecord: function(nombre){
        firebase.once('value', function(snap) {
          var hijoPreset = presets.child(nombre);
          hijoPreset.set(snap.val());
        });
      },
      sustituirPreset: function(nombre){
        //firebase.remove(); 
        var hijoPreset = presets.child(nombre);
        hijoPreset.once('value', function(snap) {
          firebase.set(snap.val());
        });
      },
      pillarPresets: function(){
        presets.once('value', function(todosSnap) {
          $rootScope.$apply(function(){
            deferred.resolve(todosSnap);
          });
        });
        return deferred.promise;
      }
    };
  });
