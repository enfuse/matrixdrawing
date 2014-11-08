/*tools */
'use strict';

angular.module('pixledAppTools', [])
  .factory('Tools', function ($q, $rootScope) {
    var deferred = $q.defer();
    return {
      borrarTodo: function(){
        console.log("BORRANDO TODO");
      }
    };
  });
