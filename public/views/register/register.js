var loginModule = angular.module('registerModule', ['felinotweetsApp','ngDialog']);

loginModule.controller('registerController',
  function($scope,$state,user,ngDialog) {
    console.log("RegisterController inicializado");
    $scope.notError = true;
    $scope.messageError = "";

    $scope.register = function() {
      var email = $scope.email;
      var first_name = $scope.first_name;
      var last_name = $scope.last_name;

      // posts the login user info
      user.register(email, first_name, last_name).then(function(result) {
        if (result.data.error) {

          // register error
          $scope.email = "";
          $scope.notError = false;
          $scope.messageError = result.data.message;
        }
        else {

          // resets the login form, then it should redirect
          $scope.email = "";
          $scope.first_name = "";
          $scope.last_name = "";
          $scope.pass = result.data.password;
          ngDialog.open(
              {template : '/views/register/popup.html',
               className : 'ngdialog-theme-default',
               controller: 'InsideCtrl',
               scope: $scope,
               closeByNavigation : true,
               closeByDocument: false,
               closeByEscape: false,
               showClose: false
               }
          );
          //$state.go('home');
        }
      });
    };
});

loginModule.controller('InsideCtrl', function ($scope, $state) {
    
    $scope.goHome = function(){
        $state.go('home');
    }
});


