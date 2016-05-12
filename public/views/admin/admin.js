var loginModule = angular.module('adminModule', [
  'felinotweetsApp'
]);

loginModule.controller('adminController',
  function($scope,$state,$filter,user,auth) {
    console.log("AdminController inicializado");

    // user feedback
    $scope.notError = true;
    $scope.success = false;
    $scope.selected = -1;
    $scope.editing = -1;

    // user info
    $scope.query = "";
    $scope.users = {};
    $scope.first_name = "";
    $scope.last_name = "";

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

    // updates selected user
    $scope.updateUser = function(id) {

      var first_name = $scope.editingUser.first_name;
      var last_name = $scope.editingUser.last_name;

      console.log(first_name);
      console.log(last_name);

      user.updateUser(id, first_name, last_name).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: usuario no actualizado."
          $scope.notError = false;
        }
        else {

          // user updated successfully
          $scope.success = true;
          $scope.messageSuccess = "Usuario actualizado con éxito.";
          $scope.users = result.data.message;
        }
      });
    };

    // deletes selected user
    $scope.deleteUser = function(id) {
      user.deleteUser(id).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: usuario no borrado."
          $scope.notError = false;
        }
        else {

          // user deleted successfully
          $scope.success = true;
          $scope.messageSuccess = "Usuario eliminado con éxito.";
          $scope.users = result.data.message;
        }
      });
    };

    // cancels user update
    $scope.cancelUpdate = function(id) {

      user.updateUser(id, first_name, last_name).then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: usuario no actualizado."
          $scope.notError = false;
        }
        else {

          // user updated successfully
          $scope.success = true;
          $scope.messageSuccess = "Usuario actualizado con éxito.";
          $scope.users = result.data.message;
        }
      });
    };

    // toggles the admin's permissions to edit user's info
    $scope.toggleEditing = function(index, editingUser) {
      if (!$scope.isEditing(index)) {
        $scope.editing = index;
        $scope.editingUser = editingUser;
      }
      else {
        $scope.editing = -1;
      }
    }

    // checks if the admin is editing the index-th user
    $scope.isEditing = function(index) {
      return $scope.editing == index;
    }

    $scope.toggleSelected = function(index, editingUser) {
      if (!$scope.isSelected(index)) {
        $scope.selected = index;
        $scope.editingUser = editingUser;
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
