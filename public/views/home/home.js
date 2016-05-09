var homeModule = angular.module('homeModule', [
  'felinotweetsApp'
])

  homeModule.controller('homeController',
    function($scope,$http,$location,auth){
    console.log("HomeController inicializado");

    $scope.logOut = function() {
      auth.logout && auth.logout()
    }
  });
