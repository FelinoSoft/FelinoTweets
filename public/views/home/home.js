var homeModule = angular.module('homeModule', [
  'felinotweetsApp',
  'linkify'
]);

  homeModule.controller('homeController',
    function($http,$scope,$filter,$location,$timeout,auth,twitter,home){

    $scope.GLOBAL_LOAD_TWEETS = 20;
    $scope.GLOBAL_CHECK_NEW_TWEETS_SECONDS_TIMEOUT = 120;
    $scope.timer = undefined;

    $scope.processTweet = function(tweet){
      var author;
      var name;
      var text;
      var imgLinkT;
      var nRetweets;
      var nLikes;
      var tweetID;
      var tweetLink;
      var date;
      var isRetweeted = false;
      var authorRetweetName;
      var authorRetweetLink;
      var isAnswer = false;
      var answerAuthorName;
      var answerTweetLink;
      if(tweet.retweeted_status !== undefined){
        isRetweeted = true;
        authorRetweetName = tweet.user.name;
        authorRetweetLink = "http://twitter.com/" + tweet.user.screen_name;
        author = tweet.retweeted_status.user.screen_name;
        name = tweet.retweeted_status.user.name;
        text = tweet.retweeted_status.text;
        imgLinkT = tweet.retweeted_status.user.profile_image_url;
        nRetweets = tweet.retweeted_status.retweet_count;
        nLikes = tweet.retweeted_status.favorite_count;
        tweetLink = "http://twitter.com/" +
                    tweet.retweeted_status.user.screen_name +
                    "/status/" + tweet.retweeted_status.id_str;
        tweetID = tweet.retweeted_status.id_str;
        date = new Date(tweet.retweeted_status.created_at);
        date = $filter('date')(date, 'dd MMM yyyy');
      } else{
        if(tweet.in_reply_to_status_id !== undefined && tweet.in_reply_to_status_id !== null){
          isAnswer = true;
          answerAuthorName = '@' + tweet.in_reply_to_screen_name;
          answerTweetLink = "http://twitter.com/" + tweet.in_reply_to_screen_name +
              "/status/" + tweet.in_reply_to_status_id_str;
        }
        author = tweet.user.screen_name;
        name = tweet.user.name;
        text = tweet.text;
        imgLinkT = tweet.user.profile_image_url;
        nRetweets = tweet.retweet_count;
        nLikes = tweet.favorite_count;
        tweetLink = "http://twitter.com/" + tweet.user.screen_name +
                    "/status/" + tweet.id_str;
        tweetID = tweet.id_str;
        date = new Date(tweet.created_at);
        date = $filter('date')(date, 'dd MMM yyyy');
      }
      var rted = tweet.retweeted;
      var liked = tweet.favorited;

      var finalTweet = {
        'author':author, 'name':name, 'text':text, 'imgLink':imgLinkT,
        'nRetweets':nRetweets, 'nLikes':nLikes, 'rted':rted, 'liked':liked,
        'date':date, 'tweetLink':tweetLink, 'tweetID' : tweetID, 'isRetweeted' : isRetweeted,
        'authorRetweetName' : authorRetweetName, 'authorRetweetLink' : authorRetweetLink,
        'isAnswer' : isAnswer, 'answerAuthorName' : answerAuthorName, 'answerTweetLink' : answerTweetLink
      };

      return finalTweet;
    };

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };

    $scope.getAccountPanels = function(){
      // Functions to process data
      function noTweetsUser(result){
        var info = result.data.message;
        var panel = {
          'user':info.profile_name, 'desc':info.description,
          'imgLink':info.photo_url, 'tweets':[], 'mongoID':info._id,
          'since_id':-1,'max_id':-1, 'deleting':false, 'loading':false,
          'hasMore':false, 'hasNewTweets':false, 'newTweetsList':[]
        };
        $scope.panels.push(panel);
      }

      function getAccTL(mongoID, profileName){
        home.getAccountTimeLine(mongoID, profileName, $scope.GLOBAL_LOAD_TWEETS,
          -1, -1).then(function(result){
          var tweets = result.data.message;
          var panelTweets = [];
          if(tweets.length === 0){
            home.getTwitterAccountByID(mongoID).then(noTweetsUser);
          } else{
            var user = tweets[0].user.screen_name;
            var desc = tweets[0].user.description;
            var imgLink = tweets[0].user.profile_image_url;
            var max_id = -1;
            var since_id = -1;
            for(j = 0; j < tweets.length; j++){
              if(j === 0){
                since_id = tweets[j].id;
              }
              if(j === tweets.length - 1){
                max_id = tweets[j].id;
              }
              var processedTweet = $scope.processTweet(tweets[j]);
              panelTweets.push(processedTweet);
            } // End for each tweet
            var hasMoreToLoad = panelTweets.length == $scope.GLOBAL_LOAD_TWEETS;
            var panel = {
              'user':user, 'desc':desc, 'imgLink':imgLink, 'tweets':panelTweets,
              'mongoID':mongoID, 'since_id':since_id,'max_id':max_id,
              'deleting':false, 'loading':false,'hasMore':hasMoreToLoad,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.panels.push(panel);
          } // End else if user has no tweets
        }); // End getting tweets
      }
      // End of auxiliary functions definitions

      // Start of getAccountsPanels
      var accounts;
      $scope.panels = [];

      home.getTwitterAccounts(auth.currentUser()).then(function(result){
        var twAccs = result.data.message;
        for (i = 0; i < twAccs.length; i++) {
          getAccTL(twAccs[i]._id, twAccs[i].profile_name);
        } // End for each twitter account
      });
    };

    $scope.isDeleting = function(mongoID){
      var returned;
      for(var i = 0; i < $scope.panels.length; i++){
        if($scope.panels[i].mongoID === mongoID){
          returned = $scope.panels[i].deleting;
        }
      }
      return returned;
    };

    $scope.isLoading = function(mongoID){
      var returned;
      for(var i = 0; i < $scope.panels.length; i++){
        if($scope.panels[i].mongoID === mongoID){
          returned = $scope.panels[i].loading;
        }
      }
      return returned;
    };

    $scope.isSameUserAndAuthor = function(user, author){
      return user == author;
    };

    $scope.RThasToShow = function(user, author, rted, type){
      if(user != author){
        // User can click on RT
        if(type == 1 && !rted){
          return true;
        } else if(type == 1 && rted){
          return false;
        } else if(type == 2 && !rted){
          return false;
        } else {
          return true;
        }
      } else{
        return false;
      }
    };

    $scope.twitterAuth = function(){
      twitter.twitterAuth();
    };

    $scope.deleteAccount = function(mongoID){
      // Set deleting to true
      for(var i = 0; i < $scope.panels.length; i++){
        if($scope.panels[i].mongoID === mongoID){
          $scope.panels[i].deleting = true;
        }
      }

      // Send petition to delete
      home.removeTwitterAccount(mongoID).then(function(result){
        var index;
        for(var i = 0; i < $scope.panels.length; i++){
          if($scope.panels[i].mongoID === mongoID){
            index = i;
          }
        }

        if(result.data.error){
          // Error deleting
          $scope.panels[index].deleting = false;
        } else{
          // Deleted successfully
          if (index > -1) {
            $scope.panels.splice(index, 1);
          }
        }
      });
    };

    $scope.loadMore = function(mongoID){
      // Auxiliary functions definitions
      function getAccTL(mongoID, index){
        home.getAccountTimeLine(mongoID, $scope.panels[index].user,
          $scope.GLOBAL_LOAD_TWEETS + 1, -1,
          $scope.panels[index].max_id).then(function(result){
          var tweets = result.data.message;
          for(j = 1; j < tweets.length; j++){
            if(j == tweets.length - 1){
              $scope.panels[index].max_id = tweets[j].id;
            }
            var processedTweet = $scope.processTweet(tweets[j]);
            $scope.panels[index].tweets.push(processedTweet);
          } // End for each tweet
          $scope.panels[index].hasMore =
                          (tweets.length >= $scope.GLOBAL_LOAD_TWEETS);
          $scope.panels[index].loading = false;
        });
      }

      // Set loading to true
      var index;
      for(var i = 0; i < $scope.panels.length; i++){
        if($scope.panels[i].mongoID === mongoID){
          $scope.panels[i].loading = true;
          index = i;
        }
      }

      getAccTL(mongoID, index);
    };

    $scope.createRetweet = function(tweet_id, account_id, tweet){
      twitter.createRetweet(account_id,tweet_id).then(function(result){
        if(!result.err){
          tweet.rted = true;
          tweet.nRetweets = tweet.nRetweets + 1;
        }
      });
    };

    $scope.deleteRetweet = function(tweet_id, account_id,tweet){
      twitter.deleteRetweet(account_id,tweet_id).then(function(result){
        if(!result.err){
          tweet.rted = false;
          tweet.nRetweets = tweet.nRetweets - 1;
        }
      });
    };

    $scope.createFav = function(tweet_id, account_id,tweet){
      twitter.createFav(account_id,tweet_id).then(function(result){
        if(!result.err){
          tweet.liked = true;
          tweet.nLikes = tweet.nLikes + 1;
        }
      });
    };

    $scope.deleteFav = function(tweet_id, account_id,tweet){
      twitter.deleteFav(account_id,tweet_id).then(function(result){
        if(!result.err){
          tweet.liked = false;
          tweet.nLikes = tweet.nLikes - 1;
        }
      });
    };

    $scope.$on('$destroy', function(){
      $timeout.cancel($scope.timer);
    });

    $scope.setCheckingTimeOut = function(){
      function callForCheckNewTweets(){
        $scope.checkForNewTweets();
        $scope.timer = $timeout(callForCheckNewTweets,
          $scope.GLOBAL_CHECK_NEW_TWEETS_SECONDS_TIMEOUT * 1000);
      }
      $scope.timer = $timeout(callForCheckNewTweets,
        $scope.GLOBAL_CHECK_NEW_TWEETS_SECONDS_TIMEOUT * 1000);
    };

    $scope.checkForNewTweets = function(){
      // Auxiliary function
      function getNewTweets(mongoID, i, max_id_temp){
        home.getAccountTimeLine($scope.panels[i].mongoID,
          $scope.panels[i].user, $scope.GLOBAL_LOAD_TWEETS + 1,
          $scope.panels[i].since_id, max_id_temp).then(function(result){
          var tweets = result.data.message;
          if(tweets.length > 0){
            var index = i;
            var arrayTemp = [];

            var originalSinceID = $scope.panels[index].since_id;
            // For each tweet
            for(j = 0; j < tweets.length; j++){
              if(j === 0){
                $scope.panels[index].since_id = tweets[j].id;
              }
              if(j == tweets.length - 1){
                max_id_temp = tweets[j].id;
              }
              /* PROCESSING TWEET */
              if(tweets[j].id != originalSinceID){
                var processedTweet = $scope.processTweet(tweets[j]);
                arrayTemp.push(processedTweet);
              }
            } // End for each tweet

            $scope.panels[index].newTweetsList =
                          arrayTemp.concat($scope.panels[index].newTweetsList);

            if(tweets.length < $scope.GLOBAL_LOAD_TWEETS){
              // There are no more tweets to load. No new call required
            } else{
              // There may be new tweets to load
              getNewTweets(mongoID, index, max_id_temp);
            }
            $scope.panels[index].hasNewTweets =
                            $scope.panels[index].newTweetsList.length > 0;
          } // End of if there are tweets
        });
      }

      // For each panel search new tweets
      for(var i = 0; i < $scope.panels.length; i++){
        getNewTweets($scope.panels[i].mongoID,i,-1);
      }
    };

    $scope.showNewTweets = function(mongoID){
      var index;
      for(var i = 0; i < $scope.panels.length; i++){
        if($scope.panels[i].mongoID === mongoID){
          index = i;
        }
      }
      $scope.panels[index].tweets =
          $scope.panels[index].newTweetsList.concat($scope.panels[index].tweets);
      $scope.panels[index].newTweetsList = [];
      $scope.panels[index].hasNewTweets = false;

    };

    /* WHEN LANDING ON HOME */
    // Call to getAccountPanels
    $scope.getAccountPanels();
    $scope.setCheckingTimeOut();
  });
