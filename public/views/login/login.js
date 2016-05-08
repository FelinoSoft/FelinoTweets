var loginModule = angular.module('loginModule', ['felinotweetsApp']);

loginModule.controller('loginController',
  function($scope,$http,$location,user,auth) {
    console.log("LoginController inicializado");
    $scope.notError = true;

    $scope.login = function() {
      var email = $scope.formData.email;
      var pass = $scope.formData.password;
      console.log($scope.formData);

      // posts the login user info
      user.login(email, pass).error(function(error) {
        $scope.formData = {};
        $scope.notError = false;
      }).then(function(error) {

        if (error.data.error) {

          // login error
          $scope.formData = {};
          $scope.notError = false;
        }
        else {

          // resets the login form, then it should redirect
          $scope.formData = {};
          $location.path("/");
        }
      });
    };

    $scope.getUsers = function() {
      console.log("getUsers invocado");

      // posts the login user info
      user.getUsers();
    };
});

//   loginModule.controller('loginController', ['user','auth',
//     function($scope,$http,$location,user,auth){
//       $scope.notError = true;
//
//       console.log("LoginController inicializado");
//
//       $scope.login = function() {
//         console.log($scope.formData.email);
//         user.login($scope.formData.email, $scope.formData.password);
//         console.log($scope.formData.password);
//         // $http.post('/login', $scope.formData)
//         //   .success(function(data){
//         //       $scope.formData = {};
//         //       console.log(data);
//         //   })
//         //   .error(function(data){
//         //       console.log(data.message);
//         //       $scope.notError = false;
//         //       $location.path("/main");
//         //   });
//     };
// }]);
