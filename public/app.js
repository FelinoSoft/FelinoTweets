angular.module('felinotweetsApp', [
  'ui.router',
  'mainModule',
  'homeModule',
  'loginModule',
  'registerModule',
  'adminModule'
])

.constant('API', 'http://localhost:8888')
//.constant('API', 'http://felinotweets.tk')
.factory('authInterceptor', function(API, auth) {
  return {

    // attach Authorization header
    request: function(config) {
      var token = auth.getToken();
      if(config.url.indexOf(API) === 0 && token) {
        config.headers.Authorization = token;
      }

      // console.log("PETICION");
      // console.log(config);

      return config;
    },

    // if a token was sent back, save it
    response: function(res) {
      if(res.config.url.indexOf(API) === 0 && res.data.token) {
        auth.saveToken(res.data.token);
      }

      // console.log("RESPUESTA");
      // console.log(res);

      return res;
    }
  }
})

.controller('appController', function($scope, auth) {
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
  $scope.logOut = function() {
    auth.logout && auth.logout()
  }
  $scope.isLoggedIn = function() {
    var logged = auth.isAuthed ? auth.isAuthed() : false;
    console.log("Logeado: " + logged + " ??");
    return logged;
  }
})

.service('user', function($http, API) {
  var self = this;

  // obtiene todos los usuarios
  self.getUsers = function() {
    return $http.get(API + '/users')
  }

  // obtiene todos los usuarios
  self.deleteUser = function(id) {
    console.log("Intentando borrar usuario " + id);
    return $http.delete(API + '/users/' + id)
  }

  // register method
  self.register = function(email, first_name, last_name) {
    return $http.post(API + '/register', {
      email: email,
      first_name: first_name,
      last_name: last_name
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
      // console.log("Autentificando");
      // console.log(token);

      var params = self.parseJwt(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    }
  }

  self.isAdmin = function(){
    if(self.isAuthed()){
      var token = self.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.admin;
    }
  }

  self.currentUser = function(){
    if(self.isAuthed()){
      var token = self.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.user_id;
    }
  }

  // deletes the token from localStorage
  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  }
})

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  function($stateProvider,$urlRouterProvider,
    $locationProvider,$httpProvider) {

    // routing with states
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/views/main/main.html',
        controller: 'appController',
        onEnter: ['$state', 'auth', function($state, auth) {
          if(auth.isAuthed()) {
            $state.go('home');
          }
        }]
      })
      .state('login', {
        url: '/login',
        templateUrl: '/views/login/login.html',
        controller: 'loginController',
        onEnter: ['$state', 'auth', function($state, auth) {
          if(auth.isAuthed()) {
            $state.go('home');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/views/register/register.html',
        controller: 'registerController',
        onEnter: ['$state', 'auth', function($state, auth) {
          if(auth.isAuthed()) {
            $state.go('home');
          }
        }]
      })
      .state('home', {
        url: '/home',
        templateUrl: '/views/home/home.html',
        controller: 'homeController',
        onEnter: ['$state', 'auth', function($state, auth) {
          if(!auth.isAuthed()) {
            $state.go('login');
          }
          else if(auth.isAdmin()) {
            $state.go('admin');
          }
        }]
      })
      .state('homeStats', {
        url: '/homeStats',
        templateUrl: '/views/homeStats/homeStats.html',
        controller: 'appController',
        onEnter: ['$state', 'auth', function($state, auth) {
          if(!auth.isAuthed()) {
            $state.go('login');
          }
          else if(auth.isAdmin()) {
            $state.go('adminStats');
          }
        }]
      })
      .state('admin', {
        url: '/admin',
        templateUrl: '/views/admin/admin.html',
        controller: 'adminController',
        onEnter: ['$state', 'auth',
            function($state, auth) {
          if(!auth.isAuthed()) {
            $state.go('login');
          }
          else if(!auth.isAdmin()) {
            $state.go('home');
          }
          else {

            // loads users info
            //$scope.users = $scope.getUsers();
          }
        }]
      })
      .state('adminStats', {
        url: '/adminStats',
        templateUrl: '/views/adminStats/adminStats.html',
        controller: 'adminStatsController',
        onEnter: ['$state', 'auth', function($state, auth) {
          if(!auth.isAuthed()) {
            $state.go('login');
          }
          else if(!auth.isAdmin()) {
            $state.go('home');
          }
        }]
      });

    $urlRouterProvider.otherwise('/');

    // http interceptor
    $httpProvider.interceptors.push('authInterceptor');

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}])
