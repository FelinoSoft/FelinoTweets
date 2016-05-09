var loginModule = angular.module('adminModule', [
  'felinotweetsApp'
]);

loginModule.controller('adminController',
  function($scope,$state,user,auth) {
    console.log("AdminController inicializado");
    $scope.notError = true;
    $scope.success = false;
    $scope.query = "";
    $scope.users = {};
    $scope.selected = -1;

    user.getUsers().then(function(result) {
      if (result.data.error) {

        // login error, resets only the password field
        $scope.messageError = "Error: no se ha podido recuperar a los usuarios."
        $scope.notError = false;
      }
      else {

        // usuarios obtenidos con exito
        $scope.users = result.data.message;

        }
    });

    $scope.deleteUser = function(id) {

      // deletes selected user
      user.deleteUser(id).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: usuario no borrado."
          $scope.notError = false;
        }
        else {

          // usuario borado con exito
          $scope.success = true;
          $scope.messageSuccess = "Usuario eliminado con éxito.";
          $scope.users = result.data.message;
        }
      });
    };

    $scope.toggleSelected = function(index) {
      if (!$scope.isSelected(index)) {
        $scope.selected = index;
      }
      else {
        $scope.selected = -1;
      }
    }

    $scope.isSelected = function(index) {
      return $scope.selected == index;
    }

    $scope.logOut = function() {
      auth.logout && auth.logout()
    }
});
