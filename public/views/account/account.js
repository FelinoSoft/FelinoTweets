var accountModule = angular.module('accountModule', [
  'felinotweetsApp',
  'linkify',
  'ngDialog'
]);

accountModule.controller('accountController',
  function($scope,$http,$location,$filter,$stateParams,$timeout,auth,twitter,home,account,ngDialog){
    console.log("AccountController inicializado");
    $scope.userInfo = {};
    $scope.addingHashtag = false;
    $scope.implemented = false;
    $scope.tweeting = false;
    $scope.sendingTweet = false;
    $scope.scheduledTweets = {};
    $scope.homeStarted = false;
    $scope.TLStarted = false;
    $scope.mentionsStarted = false;
    $scope.errorTweeting = false;
    $scope.tweet = {};

    $scope.GLOBAL_LOAD_TWEETS = 20;
    $scope.GLOBAL_CHECK_NEW_TWEETS_SECONDS_TIMEOUT = 120;

    $scope.getUserInfo = function(){

      // Auxiliary functions
      function getHomePanel(accountID, accountName){
        account.getTweetsPanel('home', accountID, accountName, $scope.GLOBAL_LOAD_TWEETS + 1, -1, -1).then(function(result){
          console.log(result);
          var tweets = result.data.message;
          var panelTweets = [];
          var max_id = -1;
          var since_id = -1;
          var panel;
          if(tweets.length !== 0){
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
            console.log(panelTweets.length);
            var hasMoreToLoad = panelTweets.length >= $scope.GLOBAL_LOAD_TWEETS;
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':hasMoreToLoad,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.userInfo.homePanel = panel;
          } else {
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':false,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.userInfo.homePanel = panel;
          }
          $scope.homeStarted = true;
        });
      }

      function getTLPanel(accountID, accountName){
        account.getTweetsPanel('timeline', accountID, accountName, $scope.GLOBAL_LOAD_TWEETS, -1, -1).then(function(result){
          var tweets = result.data.message;
          var panelTweets = [];
          var max_id = -1;
          var since_id = -1;
          var panel;
          if(tweets.length !== 0){
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
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':hasMoreToLoad,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.userInfo.TLPanel = panel;
          } else {
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':false,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.userInfo.TLPanel = panel;
          }
          $scope.TLStarted = true;
        });
      }

      function getMentionsPanel(accountID, accountName){
        account.getTweetsPanel('mentions', accountID, accountName, $scope.GLOBAL_LOAD_TWEETS, -1, -1).then(function(result){
          var tweets = result.data.message;
          var panelTweets = [];
          var max_id = -1;
          var since_id = -1;
          var panel;
          if(tweets.length !== 0){
            for(j = 0; j < tweets.length; j++){
              if(j === 0){
                since_id = tweets[j].id;
              }
              if(j === tweets.length - 1){
                max_id = tweets[j].id;
              }
              var processedTweet = $scope.processMention(tweets[j]);
              panelTweets.push(processedTweet);
            } // End for each tweet
            var hasMoreToLoad = panelTweets.length == $scope.GLOBAL_LOAD_TWEETS;
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':hasMoreToLoad,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.userInfo.mentionsPanel = panel;
          } else {
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':false,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.userInfo.mentionsPanel = panel;
          }
          $scope.mentionsStarted = true;
        });
      }

      function getHashtagsPanels(accountID, accountName){

        // Auxiliary function
        

        $scope.userInfo.hashtagsPanel = [];
        account.getHashtags(accountID).then(function(result){
          console.log(result);
          var arrayHashtags = result.data.message;
          if(!result.data.error){

          }
        });
        /*
        account.getTweetsPanel('mentions', accountID, accountName, $scope.GLOBAL_LOAD_TWEETS, -1, -1).then(function(result){
          var tweets = result.data.message;
          var panelTweets = [];
          var max_id = -1;
          var since_id = -1;
          var panel;
          if(tweets.length !== 0){
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
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':hasMoreToLoad,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.mentionsPanel = panel;
          } else {
            panel = {
              'tweets':panelTweets,
              'mongoID':accountID, 'since_id':since_id,'max_id':max_id,
              'loading':false,'hasMore':false,
              'hasNewTweets':false, 'newTweetsList':[]
            };
            $scope.mentionsPanel = panel;
          }
        });*/
      }

      $scope.userInfo.mongoID = $stateParams.account_id;
      home.getTwitterAccountByID($scope.userInfo.mongoID).then(function(result){
        if(!result.data.error){
          var info = result.data.message;
          $scope.userInfo.accountName = info.profile_name;
          $scope.userInfo.accountID = info._id;
          $scope.userInfo.imgLink = info.photo_url;

          // Call to fill panels
          getHomePanel($scope.userInfo.accountID, $scope.userInfo.accountName);
          getTLPanel($scope.userInfo.accountID, $scope.userInfo.accountName);
          getMentionsPanel($scope.userInfo.accountID, $scope.userInfo.accountName);
          getHashtagsPanels($scope.userInfo.accountID, $scope.userInfo.accountName);

        }
      });
    };

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

      $scope.cantTweet = function() {
          return $scope.caracteres < 0 || $scope.caracteres == 140 || ($scope.tweet.date !== undefined &&
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

        return (newHashtag === undefined) ||
            (newHashtag.length === 0) ||
            (newHashtag.split(/\s+/).length != 1) ||
            (!newHashtag.match(/^[a-z0-9]+$/i));
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
                    $scope.contarCaracteres();
                } else{
                    $scope.tweeting = false;
                    $scope.sendingTweet = false;
                    $scope.errorTweeting = true;
                    $scope.contarCaracteres();
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


    $scope.showNewTweets = function(kind, hashtagName){
      if(kind == 'home'){
        $scope.userInfo.homePanel.tweets =
            $scope.userInfo.homePanel.newTweetsList.concat($scope.userInfo.homePanel.tweets);
        $scope.userInfo.homePanel.newTweetsList = [];
        $scope.userInfo.homePanel.hasNewTweets = false;
      } else if(kind == 'timeline'){
        $scope.userInfo.TLPanel.tweets =
            $scope.userInfo.TLPanel.newTweetsList.concat($scope.userInfo.TLPanel.tweets);
        $scope.userInfo.TLPanel.newTweetsList = [];
        $scope.userInfo.TLPanel.hasNewTweets = false;
      } else if(kind == 'mentions'){
        $scope.userInfo.mentionsPanel.tweets =
            $scope.userInfo.mentionsPanel.newTweetsList.concat($scope.userInfo.mentionsPanel.tweets);
        $scope.userInfo.mentionsPanel.newTweetsList = [];
        $scope.userInfo.mentionsPanel.hasNewTweets = false;
      } else if(kind == 'hashtag'){
        $scope.userInfo.homePanel.tweets =
            $scope.userInfo.homePanel.newTweetsList.concat($scope.userInfo.homePanel.tweets);
        $scope.userInfo.homePanel.newTweetsList = [];
        $scope.userInfo.homePanel.hasNewTweets = false;
      }
    };

    $scope.isSameUserAndAuthor = function(user, author){
      return user == author;
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

    $scope.isLoading = function(kind, hashtag){
      if(kind == 'home' && $scope.homeStarted){
        return $scope.userInfo.homePanel.loading;
      } else if(kind == 'timeline' && $scope.TLStarted){
        return $scope.userInfo.TLPanel.loading;
      } else if(kind == 'mentions' && $scope.mentionsStarted){
        return $scope.userInfo.mentionsPanel.loading;
      }
    };

    $scope.loadMore = function(kind, hashtag){
      // Auxiliary functions definitions
      function getMoreTweets(kind, hashtag){
        var max_id;
        if(kind == 'home'){
          max_id = $scope.userInfo.homePanel.max_id;
        } else if(kind == 'timeline'){
          max_id = $scope.userInfo.TLPanel.max_id;
        } else if(kind == 'mentions'){
          max_id = $scope.userInfo.mentionsPanel.max_id;
        }
        account.getTweetsPanel(kind, $scope.userInfo.accountID, $scope.userInfo.accountName,
          $scope.GLOBAL_LOAD_TWEETS + 1, -1, max_id).then(function(result){
          var tweets = result.data.message;
          var minusJ = 0;
          if(kind == 'mentions'){
            minusJ = 1;
          }
          for(j = 1 - minusJ; j < tweets.length; j++){
            var processedTweet;
            if(kind == 'home'){
              if(j == tweets.length - 1){
                $scope.userInfo.homePanel.max_id = tweets[j].id;
              }
              processedTweet = $scope.processTweet(tweets[j]);
              $scope.userInfo.homePanel.tweets.push(processedTweet);
            } else if(kind == 'timeline'){
              if(j == tweets.length - 1){
                $scope.userInfo.TLPanel.max_id = tweets[j].id;
              }
              processedTweet = $scope.processTweet(tweets[j]);
              $scope.userInfo.TLPanel.tweets.push(processedTweet);
            } else if(kind == 'mentions'){
              if(j == tweets.length - 1){
                $scope.userInfo.mentionsPanel.max_id = tweets[j].id;
              }
              processedTweet = $scope.processTweet(tweets[j]);
              $scope.userInfo.mentionsPanel.tweets.push(processedTweet);
            }
          } // End for each tweet
          if(kind == 'home'){
            $scope.userInfo.homePanel.hasMore =
                            (tweets.length >= $scope.GLOBAL_LOAD_TWEETS);
            $scope.userInfo.homePanel.loading = false;
          } else if(kind == 'timeline'){
            $scope.userInfo.TLPanel.hasMore =
                            (tweets.length >= $scope.GLOBAL_LOAD_TWEETS);
            $scope.userInfo.TLPanel.loading = false;
          } else if(kind == 'mentions'){
            $scope.userInfo.mentionsPanel.hasMore =
                            (tweets.length >= $scope.GLOBAL_LOAD_TWEETS);
            $scope.userInfo.mentionsPanel.loading = false;
          }
        });
      }

      if(kind == 'home'){
        $scope.userInfo.homePanel.loading = true;
      } else if(kind == 'timeline'){
        $scope.userInfo.TLPanel.loading = true;
      } else if(kind == 'mentions'){
        $scope.userInfo.mentionsPanel.loading = true;
      }

      getMoreTweets(kind, hashtag);
    };

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
      if(tweet.retweeted_status !== undefined){
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
        'date':date, 'tweetLink':tweetLink, 'tweetID' : tweetID
      };

      return finalTweet;
    };

    $scope.processMention = function(tweet){
      var author;
      var name;
      var text;
      var imgLinkT;
      var nRetweets;
      var nLikes;
      var tweetID;
      var tweetLink;
      var date;
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
      var rted = tweet.retweeted;
      var liked = tweet.favorited;

      var finalTweet = {
        'author':author, 'name':name, 'text':text, 'imgLink':imgLinkT,
        'nRetweets':nRetweets, 'nLikes':nLikes, 'rted':rted, 'liked':liked,
        'date':date, 'tweetLink':tweetLink, 'tweetID' : tweetID
      };

      return finalTweet;
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

    $scope.setCheckingTimeout = function(){
      function callForCheckNewTweets(){
        $scope.checkForNewTweets();
        $timeout(callForCheckNewTweets,
          $scope.GLOBAL_CHECK_NEW_TWEETS_SECONDS_TIMEOUT * 1000);
      }

      $timeout(callForCheckNewTweets,
        $scope.GLOBAL_CHECK_NEW_TWEETS_SECONDS_TIMEOUT * 1000);
    };

    $scope.checkForNewTweets = function(){
      // Auxiliary function
      function getNewTweets(kind, hashtag, max_id_temp){
        var since_id;
        if(kind == 'home'){
          since_id = $scope.userInfo.homePanel.since_id;
        } else if(kind == 'timeline'){
          since_id = $scope.userInfo.TLPanel.since_id;
        } else if(kind == 'mentions'){
          since_id = $scope.userInfo.mentionsPanel.since_id;
        }
        account.getTweetsPanel(kind, $scope.userInfo.accountID, $scope.userInfo.accountName,
          $scope.GLOBAL_LOAD_TWEETS + 1, since_id, max_id_temp).then(function(result){
          var tweets = result.data.message;
          if(tweets.length > 0){
            var arrayTemp = [];
            var originalSinceID;
            var processedTweet;
            if(kind == 'home'){
              originalSinceID = $scope.userInfo.homePanel.since_id;
              // For each tweet
              for(j = 0; j < tweets.length; j++){
                if(j === 0){
                  $scope.userInfo.homePanel.since_id = tweets[j].id;
                }
                if(j == tweets.length - 1){
                  max_id_temp = tweets[j].id;
                }
                /* PROCESSING TWEET */
                if(tweets[j].id != originalSinceID){
                  processedTweet = $scope.processTweet(tweets[j]);
                  arrayTemp.push(processedTweet);
                }
              }

              $scope.userInfo.homePanel.newTweetsList =
                            arrayTemp.concat($scope.userInfo.homePanel.newTweetsList);
            } else if (kind == 'timeline'){
              originalSinceID = $scope.userInfo.TLPanel.since_id;
              // For each tweet
              for(j = 0; j < tweets.length; j++){
                if(j === 0){
                  $scope.userInfo.TLPanel.since_id = tweets[j].id;
                }
                if(j == tweets.length - 1){
                  max_id_temp = tweets[j].id;
                }
                /* PROCESSING TWEET */
                if(tweets[j].id != originalSinceID){
                  processedTweet = $scope.processTweet(tweets[j]);
                  arrayTemp.push(processedTweet);
                }
              }

              $scope.userInfo.TLPanel.newTweetsList =
                            arrayTemp.concat($scope.userInfo.TLPanel.newTweetsList);
            } else if (kind == 'mentions'){
              originalSinceID = $scope.userInfo.mentionsPanel.since_id;
              // For each tweet
              for(j = 0; j < tweets.length; j++){
                if(j === 0){
                  $scope.userInfo.mentionsPanel.since_id = tweets[j].id;
                }
                if(j == tweets.length - 1){
                  max_id_temp = tweets[j].id;
                }
                /* PROCESSING TWEET */
                if(tweets[j].id != originalSinceID){
                  processedTweet = $scope.processTweet(tweets[j]);
                  arrayTemp.push(processedTweet);
                }
              }

              $scope.userInfo.mentionsPanel.newTweetsList =
                            arrayTemp.concat($scope.userInfo.mentionsPanel.newTweetsList);
            }

            if(tweets.length < $scope.GLOBAL_LOAD_TWEETS){
              // There are no more tweets to load. No new call required
            } else{
              // There may be new tweets to load
              getNewTweets(kind, hashtag, max_id_temp);
            }
            if(kind == 'home'){
              $scope.userInfo.homePanel.hasNewTweets =
                              $scope.userInfo.homePanel.newTweetsList.length > 0;
            } else if(kind == 'timeline'){
              $scope.userInfo.TLPanel.hasNewTweets =
                              $scope.userInfo.TLPanel.newTweetsList.length > 0;
            } else if(kind == 'mentions'){
              $scope.userInfo.mentionsPanel.hasNewTweets =
                              $scope.userInfo.mentionsPanel.newTweetsList.length > 0;
            }
          } // End of if there are tweets
        });
      }

      getNewTweets('home','none', -1);
      getNewTweets('timeline','none',-1);
      getNewTweets('mentions', 'none', -1);
      // TODO
    };

      $scope.replyDialog = function(tweetID, author, nombre){

          $scope.tweetID = tweetID;
          $scope.account_id = $stateParams.account_id;
          $scope.user_name = '@' + author + ' ';
          $scope.nombre = nombre;
          ngDialog.open(
              {template : '/views/account/reply.html',
                  className : 'ngdialog-theme-default',
                  controller: 'ReplyCtrl',
                  scope: $scope,
                  closeByNavigation : true,
                  closeByDocument: true,
                  closeByEscape: true,
                  showClose: true,
                  preCloseCallback: function() {
                      $scope.tweet = {};
                  }
              }
          );
      };

      // Calls to functions when arriving
    $scope.getUserInfo();

    $scope.setCheckingTimeout();

});

accountModule.controller('ReplyCtrl', function ($scope, twitter) {

    $scope.tweet.text = $scope.user_name;

    $scope.reply = function(){
        twitter.postTweet($scope.account_id, $scope.tweet.text, $scope.tweetID).then(function(result){
            if(!result.data.error){
                $scope.tweeting = false;
                $scope.sendingTweet = false;
                $scope.closeThisDialog(false);
            } else{
                $scope.tweeting = false;
                $scope.sendingTweet = false;
                $scope.errorTweeting = true;
                $scope.closeThisDialog(true);
            }
        });
        $scope.tweet = {};
        $scope.contarCaracteres();
        $scope.sendingTweet = true;
    };

});
