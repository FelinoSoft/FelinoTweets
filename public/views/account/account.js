var accountModule = angular.module('accountModule', [
  'felinotweetsApp'
]);

accountModule.controller('accountController',
  function($scope,$http,$location,$stateParams,auth,twitter){
    console.log("AccountController inicializado");
    $scope.addingHashtag = false;
    $scope.implemented = false;
    $scope.tweeting = false;


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

    $scope.cantTweet = function(length, date){
      return length < 0 || length == 140 || (date!==undefined && new Date(date).getTime() < Date.now());
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

    $scope.isTweeting = function(){
        return $scope.tweeting;
    };

    $scope.setTweeting = function(tweeting){
        $scope.tweeting = tweeting;
    };

    $scope.postTweet = function(){
        if($scope.tweet.date === undefined){
            twitter.postTweet($stateParams.account_id, $scope.tweet.text).then(function(result){
                if(!result.error){
                    $scope.tweeting = false;
                }
            });
        } else{
            twitter.postScheduledTweet($stateParams.account_id, $scope.tweet.text,
                new Date($scope.tweet.date).getTime()).then(function(result){
                if(!result.error){
                    $scope.tweeting = false;
                }
            });
        }
        $scope.tweet = {}
    }
});
