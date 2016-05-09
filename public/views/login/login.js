var loginModule = angular.module('loginModule', ['felinotweetsApp']);

loginModule.controller('loginController',
  function($scope,$state,user) {
    console.log("LoginController inicializado");
    $scope.notError = true;

    $scope.login = function() {
      var email = $scope.formData.email;
      var pass = $scope.formData.password;
      console.log($scope.formData);

      // posts the login user info
      user.login(email, pass).then(function(error) {
        if (error.data.error) {

          // login error
          $scope.formData = {};
          $scope.notError = false;
        }
        else {

          // resets the login form, then it should redirect
          $scope.formData = {};
          $state.go('home');
        }
      });
    };
});
