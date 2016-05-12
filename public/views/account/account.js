var homeModule = angular.module('accountModule', [
  'felinotweetsApp'
]);

accountModule.controller('accountController',
  function($scope,$http,$location,auth){
    console.log("AccountController inicializado");

    $scope.implemented = false;

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    $scope.getPanel = function(kind, index) {
      if(kind == "TL"){
        // Get data of timeline

      }
    };
});
