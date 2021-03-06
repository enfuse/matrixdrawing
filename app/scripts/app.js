'use strict';

if (!window.pixled) {
  $('body').html('<div class="alert alert-danger" role="alert"> <strong>App not configured, copy scripts/example.config.js to scripts/config.js and build your own config</strong></div>');
  throw 'App not configured';
}

angular.module('pixledApp', [
  'angularSpectrumColorpicker',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'pixledAppCoordenas',
  'ngRoute',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap'
])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      /*
       .when('/snake', {
       templateUrl: 'views/snake.html',
       controller: 'SnakeCtrl'
       })
       .when('/iconos/:param1', {
       templateUrl: 'views/iconos.html',
       controller: 'IconosCtrl'
       })
       */
      .otherwise({
        redirectTo: '/'
      });
  });
