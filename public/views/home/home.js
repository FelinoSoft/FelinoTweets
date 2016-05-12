var accountModule = angular.module('accountModule', [
  'felinotweetsApp'
]);

  accountModule.controller('accountController',
    function($scope,auth){
    console.log("accountController inicializado");

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    $scope.getPanel = function(kind) {
      
    };
  });
