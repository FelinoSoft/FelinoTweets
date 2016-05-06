var app = angular.module('felinotweetsApp', [
  'ngRoute',
  'angularCSS',
  'mainModule',
  'homeModule',
  'loginModule',
  'registerModule'
]);

  app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider.
        when('/', {
          // redirects to '/'
          templateUrl: 'views/main/main.html',
          controller: 'mainController',
          css: 'views/main/main.css'
        }).
        when('/home', {
          // redirects to '/home'
          templateUrl: 'views/home/home.html',
          controller: 'homeController',
          css: 'views/home/home.css'
        }).
        when('/login', {
          // redirects to '/login'
          templateUrl: 'views/login/login.html',
          controller: 'loginController',
          css: 'views/login/login.css'
        }).
        when('/register', {
          // redirects to '/register'
          templateUrl: 'views/register/register.html',
          controller: 'registerController',
          css: 'views/register/register.css'
        }).
        otherwise({
          // redirects to main page
          redirectTo: '/'
        });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
  }]);

  app.controller('appController', function($scope,$http,$location) {
    $scope.title = "FelinoTweets";
  });
