'use strict';

angular.module('test', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'firebase', 'ngResource', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
