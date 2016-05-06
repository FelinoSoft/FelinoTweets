angular.module('loginModule', [])

  .controller('loginController', function($scope,$http,$location){
    $scope.formData = {};
    $scope.notError = true;

    $scope.login = function(){
      $http.post('/login', $scope.formData)
        .success(function(data){
            $scope.formData = {};
            console.log(data);
        })
        .error(function(data){
            console.log(data.message);
            $scope.notError = false;
            $location.path("/main");
        });
    };
});
