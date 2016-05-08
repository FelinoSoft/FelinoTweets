angular.module('felinotweetsApp', [
  'ngRoute',
  'mainModule',
  'homeModule',
  'loginModule',
  'registerModule'
])

// .constant('API', 'http://felinotweets.tk')
.constant('API', 'http://localhost:8888')
.factory('authInterceptor', function(API, auth) {
  return {

    // attach Authorization header
    request: function(config) {
      var token = auth.getToken();
      if(config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = token;
      }

      console.log("PETICION");
      console.log(config);

      return config;
    },

    // if a token was sent back, save it
    response: function(res) {
      if(res.config.url.indexOf(API) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
      }

      console.log("RESPUESTA");
      console.log(res);

      return res;
    }
  }
})

.service('auth', function($window) {
  var self = this;

  // parses the JWT to JSON
  self.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

  // saves the token in local storage for future requests
  self.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
    console.log('Token saved.');
    console.log($window.localStorage['jwtToken']);
  }

  // obtains the token from localStorage
  self.getToken = function() {
    return $window.localStorage['jwtToken'];
    console.log('Token retrieved.');
  }

  // checks if the user's token is valid
  self.isAuthed = function() {
    var token = self.getToken();
    if(token) {
      console.log("Autentificando");
      console.log(token);

      var params = self.parseJwt(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    }
  }

  // deletes the token from localStorage
  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  }
})

.service('user', function($http, API, auth) {
  var self = this;

  // obtiene todos los usuarios
  self.getUsers = function() {
    return $http.get(API + '/users')
  }

  // register method
  self.register = function(email, password) {
    return $http.post(API + '/register', {
      email: email,
      password: password
    })
  }

  // login method
  self.login = function(email, password) {
    return $http.post(API + '/login', {
      email: email,
      password: password
    });
  };
})

.controller('appController', function(user, auth) {
  var self = this;

  function handleRequest(res) {
    var token = res.data ? res.data.token : null;
    if(token) { console.log('JWT:', token); }
    self.message = res.data.message;
  }

  self.login = function() {
    user.login(self.email, self.password)
      .then(handleRequest, handleRequest)
  }
  self.register = function() {
    user.register(self.email, self.password)
      .then(handleRequest, handleRequest)
  }
  self.getUsers = function() {
    user.getUsers()
      .then(handleRequest, handleRequest)
  }
  self.logout = function() {
    auth.logout && auth.logout()
  }
  self.isAuthed = function() {
    return auth.isAuthed ? auth.isAuthed() : false
  }
})

.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider,$locationProvider,$httpProvider) {
    $routeProvider.
      when('/', {
        // redirects to '/'
        templateUrl: 'views/main/main.html',
        controller: 'mainController'
      }).
      when('/home', {
        // redirects to '/home'
        templateUrl: 'views/home/home.html',
        controller: 'homeController'
      }).
      when('/login', {
        // redirects to '/login'
        templateUrl: 'views/login/login.html',
        controller: 'loginController'
      }).
      when('/register', {
        // redirects to '/register'
        templateUrl: 'views/register/register.html',
        controller: 'registerController'
      }).
      otherwise({
        // redirects to main page
        redirectTo: '/'
      });

      // http interceptor
      $httpProvider.interceptors.push('authInterceptor');

      // use the HTML5 History API
      $locationProvider.html5Mode(true);
}])
