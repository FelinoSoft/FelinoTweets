var loginModule = angular.module('registerModule', ['felinotweetsApp']);

loginModule.controller('registerController',
  function($scope,$state,user) {
    console.log("RegisterController inicializado");
    $scope.notError = true;
    $scope.messageError = "";

    $scope.register = function() {
      var email = $scope.email;
      var first_name = $scope.first_name;
      var last_name = $scope.last_name;

      // posts the login user info
      user.register(email, first_name, last_name).then(function(error) {
        if (error.data.error) {

          // register error
          $scope.email = "";
          $scope.notError = false;
          $scope.messageError = error.data.message;
        }
        else {

          // resets the login form, then it should redirect
          $scope.email = "";
          $scope.first_name = "";
          $scope.last_name = "";
          $state.go('home');
        }
      });
    };
});
