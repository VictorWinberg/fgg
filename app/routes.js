angular.module('website')
  .config(
    ['$routeProvider',
      function ($routeProvider) {
        $routeProvider.
        otherwise({
          redirectTo: '/',
          templateUrl: 'app/shared/home/index-template.html',
          controller: 'HomeCtrl'
        });
      }
    ]);