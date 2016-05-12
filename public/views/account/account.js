var homeModule = angular.module('homeModule', [
  'felinotweetsApp'
]);

  homeModule.controller('homeController',
    function($scope,$http,$location,auth){
    console.log("HomeController inicializado");

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
