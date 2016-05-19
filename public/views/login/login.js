var loginModule = angular.module('loginModule', [
  'felinotweetsApp'
]);

loginModule.controller('loginController',
  function($scope,$state,user) {
    $scope.notError = true;

    $scope.login = function() {
      var email = $scope.formData.email;
      var pass = $scope.formData.password;

      // posts the login user info
      user.login(email, pass).then(function(error) {
        if (error.data.error) {

          // login error, resets only the password field
          $scope.formData.password = "";
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
