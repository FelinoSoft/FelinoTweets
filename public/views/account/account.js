var accountModule = angular.module('accountModule', [
  'felinotweetsApp'
]);

accountModule.controller('accountController',
  function($scope,$http,$location,$stateParams,auth,twitter){
    console.log("AccountController inicializado");
    $scope.addingHashtag = false;
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

    $scope.canTweet = function(length){
      return length < 0;
    };

    $scope.isAddingHashtag = function(){
        return $scope.addingHashtag;
    };

    $scope.setAddingHashtag = function(addingHashtag){
        $scope.addingHashtag = addingHashtag;
        if(!addingHashtag){
            $scope.newHashtag = "";
        }
    };

    $scope.validHashtag = function(newHashtag){

        return (newHashtag === undefined)
            || (newHashtag.length == 0)
            || (newHashtag.split(/\s+/).length != 1)
            || (!newHashtag.match(/^[a-z0-9]+$/i));
    };

    $scope.saveHashtag = function(hashtag){
        twitter.saveHashtag($stateParams.account_id, hashtag);
        $scope.addingHashtag = false;
        $scope.newHashtag = "";
    };
});
