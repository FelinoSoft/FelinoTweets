var adminModule = angular.module('adminModule', [
  'felinotweetsApp'
]);

adminModule.controller('adminController',
  function($scope,$state,$filter,user,auth,twitter) {
    console.log("AdminController inicializado");

    // user feedback
    $scope.notError = true;
    $scope.success = false;
    $scope.selected = -1;
    $scope.editing = -1;

    $scope.getUsers = function() {
      user.getUsers().then(function(result) {
        if (result.data.error) {

          // login error, resets only the password field
          $scope.messageError = "Error: no se ha podido recuperar a los usuarios.";
          $scope.notError = false;
        }
        else {

          // usuarios obtenidos con exito
          $scope.users = result.data.message;

          angular.forEach($scope.users, function(value, key) {

            // checks n_tweets for old users
            if (value.n_tweets == undefined) {
              value.n_tweets = 0;
            }

            // saves twitter_accounts
            twitter.getAccountData(value._id).then(function(result) {
              if (result.data.error) {

                // login error, resets only the password field
                $scope.messageError = "Error: cuentas de twitter no recuperadas."
                $scope.notError = false;
              }
              else {

                // user deleted successfully
                var accounts = result.data.message;
                var accountString = "";

                // checks for twitter accounts
                if (accounts.length == 0) {
                  accountString = "Ninguna cuenta de twitter disponible."
                }
                else {
                  accountString = '@' + accounts[0].profile_name;
                }

                for (var i = 1; i < accounts.length; i++) {
                  accountString = accountString + ', @' + accounts[i].profile_name;
                }

                // saves the twitter acccounts string
                value.accounts = accountString;
              }
            });
          });
        }
      });
    }

    // updates selected user
    $scope.updateUser = function(id) {

      var first_name = $scope.editingUser.first_name;
      var last_name = $scope.editingUser.last_name;

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

    // Inititalizes '$scope.users'
    $scope.getUsers();
});
