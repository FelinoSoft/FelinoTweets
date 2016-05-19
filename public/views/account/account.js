var accountModule = angular.module('accountModule', [
  'felinotweetsApp',
  'linkify'
]);

accountModule.controller('accountController',
  function($scope,$http,$location,$stateParams,auth,twitter){
    console.log("AccountController inicializado");
    $scope.addingHashtag = false;
    $scope.implemented = false;
    $scope.tweeting = false;
    $scope.sendingTweet = false;
    $scope.scheduledTweets = {};
    $scope.errorTweeting = false;
    $scope.tweet = {};

    twitter.getScheduledTweets($stateParams.account_id).then(function(result){
        if(!result.error){
            $scope.scheduledTweets = result.data.message;
        } else{
            console.log(result.error);
        }
    });

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

    $scope.cantTweet = function(){
      return $scope.caracteres < 0 || $scope.caracteres == 140 || ($scope.tweet.date!==undefined &&
                                                    new Date($scope.tweet.date).getTime() < Date.now());
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
                if(!result.data.error){
                    $scope.tweeting = false;
                    $scope.sendingTweet = false;
                } else{
                    $scope.tweeting = false;
                    $scope.sendingTweet = false;
                    $scope.errorTweeting = true;
                }
            });
        } else{
            twitter.postScheduledTweet($stateParams.account_id, $scope.tweet.text,
                new Date($scope.tweet.date).getTime()).then(function(result){
                if(!result.data.error){
                    $scope.tweeting = false;
                    $scope.sendingTweet = false;
                    $scope.scheduledTweets = result.data.message;
                } else{
                    $scope.tweeting = false;
                    $scope.sendingTweet = false;
                    $scope.errorTweeting = true;
                }
            });
        }
        $scope.tweet = {};
        $scope.sendingTweet = true;
    };

    $scope.isSendingTweet = function(){
        return $scope.sendingTweet;
    };

    $scope.deleteScheduledTweet = function(idTweet){
        twitter.deleteScheduledTweet($stateParams.account_id, idTweet).then(function(result){
            if(!result.data.error){
               $scope.scheduledTweets = result.data.message;
           }
        });
    };

    $scope.contarCaracteres = function(){
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

        var match = urlRegex.exec($scope.tweet.text);

        var count = 0;

        var texto = $scope.tweet.text.length;

        while(match != null){
            texto = texto - match[0].length;
            match = urlRegex.exec($scope.tweet.text);
            count++;
        }

        $scope.caracteres = 140 - (texto + count*19);
    };

});
