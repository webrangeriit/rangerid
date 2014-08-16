'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'myApp.config',
    'myApp.controllers',
    'myApp.decorators',
    'myApp.directives',
    'myApp.filters',
    'myApp.routes',
    'myApp.services',
    "ngTouch",
    "angularCharts",
    "mobile-angular-ui"
  ])

  .run(['simpleLogin', function(simpleLogin) {
    console.log('run'); //debug
    simpleLogin.getUser();
  }])
