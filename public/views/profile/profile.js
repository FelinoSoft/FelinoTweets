var profileModule = angular.module('profileModule', [
    'felinotweetsApp'
]);

profileModule.controller('profileController',
    function($scope,$state,$filter,$location,user,auth,twitter) {

        // user feedback
        $scope.notError = true;
        $scope.success = false;
        $scope.editing = false;
        $scope.thisUser = {};

        $scope.getUser = function(id) {
            user.getUser(id).then(function(result) {
                if (result.data.error) {

                    // login error, resets only the password field
                    $scope.messageError = "Error: no se ha podido recuperar al usuario.";
                    $scope.notError = false;
                }
                else {

                    // usuarios obtenidos con exito
                    $scope.thisUser = result.data.message;

                    // saves twitter_accounts
                    twitter.getAccountData(auth.currentUser()).then(function(result) {
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
                            $scope.thisUser.accounts = accountString;
                        }
                    });
                }
            });
        };

        // updates selected user
        $scope.updateUser = function() {

            var first_name = $scope.thisUser.first_name;
            var last_name = $scope.thisUser.last_name;
            var password = $scope.thisUser.newPassword;

            user.updateMyself(auth.currentUser(), first_name, last_name, password).then(function(result) {
                if (result.data.error) {

                    // login error, resets only the password field
                    $scope.messageError = "Error: usuario no actualizado.";
                    $scope.notError = false;
                }
                else {

                    // user updated successfully
                    $scope.success = true;
                    $scope.messageSuccess = "Usuario actualizado con éxito.";
                    $scope.thisUser = result.data.message;
                }
            });
        };

        // deletes selected user
        $scope.deleteUser = function() {
            user.deleteUser(auth.currentUser()).then(function(result) {
                if (result.data.error) {

                    // login error, resets only the password field
                    $scope.messageError = "Error: usuario no borrado.";
                    $scope.notError = false;
                }
                else {
                    $scope.success = true;
                    $scope.messageSuccess = "Usuario eliminado con éxito.";
                    $scope.thisUser = result.data.message;
                    // user deleted successfully
                    $scope.logOut();
                    $location.path('/');
                }
            });
        };

        // toggles the admin's permissions to edit user's info
        $scope.toggleEditing = function() {
            $scope.editing = !$scope.editing;
        };

        // checks if the admin is editing the index-th user
        $scope.isEditing = function() {
            return $scope.editing;
        };

        $scope.logOut = function() {
            auth.logout && auth.logout()
        };

        $scope.samePasswords = function(){
            return $scope.thisUser.newPassword === $scope.thisUser.confirm_password;
        };

        // Inititalizes '$scope.users'
        $scope.getUser(auth.currentUser());
    });
