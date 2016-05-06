angular.module('mainModule', [])

  .controller('mainController', function($scope,$http,$location){
    console.log("Main controller iniciado.");
    $location.path('/');
  });
