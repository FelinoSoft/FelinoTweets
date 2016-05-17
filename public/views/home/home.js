var homeModule = angular.module('homeModule', [
  'felinotweetsApp',
  'linkify'
]);

  homeModule.controller('homeController',
    function($http,$scope,$filter,auth,twitter,home){
    console.log("homeController inicializado");

    $scope.GLOBAL_LOAD_TWEETS = 20;

    $scope.logOut = function() {
      if(auth.logout){
        auth.logout();
      }
    };


    $scope.getAccountPanels = function(){
      var accounts;
      $scope.panels = [];
      home.getTwitterAccounts(auth.currentUser()).then(function(result){
        var twAccs = result.data.message;
        console.log(twAccs);
        for (i = 0; i < twAccs.length; i++) {
          home.getAccountTimeLine(twAccs[i]._id, twAccs[i].profile_name, $scope.GLOBAL_LOAD_TWEETS, -1, -1).then(function(result){
            //console.log(result);
            var mongoID = result.data.message.pop();
            var tweets = result.data.message;
            var panelTweets = [];
            var user = tweets[0].user.screen_name;
            var desc = tweets[0].user.description;
            var imgLink = tweets[0].user.profile_image_url;
            var max_id;
            var since_id;
            console.log(tweets);
            for(j = 0; j < tweets.length; j++){
              if(j === 0){
                since_id = tweets[j].id;
              }
              if(j == tweets.length - 1){
                max_id = tweets[j].id;
              }
              var author;
              var name;
              var text;
              var imgLinkT;
              var nRetweets;
              var nLikes;
              var tweetLink;
              var date;
              if(tweets[j].retweeted){
                author = tweets[j].retweeted_status.user.screen_name;
                name = tweets[j].retweeted_status.user.name;
                text = tweets[j].retweeted_status.text;
                imgLinkT = tweets[j].retweeted_status.user.profile_image_url;
                nRetweets = tweets[j].retweeted_status.retweet_count;
                nLikes = tweets[j].retweeted_status.favorite_count;
                tweetLink = "http://twitter.com/" + tweets[j].retweeted_status.user.screen_name +
                                                        "/status/" + tweets[j].retweeted_status.id_str;
                date = new Date(tweets[j].retweeted_status.created_at);
                date = $filter('date')(date, 'dd MMM yyyy');
              } else{
                author = tweets[j].user.screen_name;
                name = tweets[j].user.name;
                text = tweets[j].text;
                imgLinkT = tweets[j].user.profile_image_url;
                nRetweets = tweets[j].retweet_count;
                nLikes = tweets[j].favorite_count;
                tweetLink = "http://twitter.com/" + tweets[j].user.screen_name +
                                                        "/status/" + tweets[j].id_str;
                date = new Date(tweets[j].created_at);
                date = $filter('date')(date, 'dd MMM yyyy');
              }
              /*text = $scope.parseText(text);*/
              var rted = tweets[j].retweeted;
              var liked = tweets[j].favorited;

              var finalTweet = {'author':author, 'name':name, 'text':text, 'imgLink':imgLinkT,
                                'nRetweets':nRetweets, 'nLikes':nLikes, 'rted':rted,
                                'liked':liked, 'date':date,
                                'tweetLink':tweetLink
                              };
              panelTweets.push(finalTweet);
            } // End for each tweet
            var hasMoreToLoad = panelTweets.length == $scope.GLOBAL_LOAD_TWEETS;
            var panel = {'user':user, 'desc':desc, 'imgLink':imgLink, 'tweets':panelTweets,
                        'mongoID':mongoID, 'since_id':since_id,'max_id':max_id,
                        'deleting':false, 'loading':false,'hasMore':hasMoreToLoad};
            $scope.panels.push(panel);
          }); // End getting tweets
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
      }, boo);
    };

    $scope.loadMore = function(mongoID, index){
      // Set loading to true
      for(var i = 0; i < $scope.panels.length; i++){
        if($scope.panels[i].mongoID === mongoID){
          $scope.panels[i].loading = true;
          index = i;
        }
      }

      home.getAccountTimeLine(mongoID, $scope.panels[index].user, $scope.GLOBAL_LOAD_TWEETS + 1, -1, $scope.panels[index].max_id).then(function(result){
        console.log(result);
        var mongoID = result.data.message.pop();
        var tweets = result.data.message;
        tweets.splice(0, 1);
        console.log(tweets);
        for(j = 0; j < tweets.length; j++){
          if(j == tweets.length - 1){
            $scope.panels[index].max_id = tweets[j].id;
          }
          var author;
          var name;
          var text;
          var imgLinkT;
          var nRetweets;
          var nLikes;
          var tweetLink;
          var date;
          if(tweets[j].retweeted){
            author = tweets[j].retweeted_status.user.screen_name;
            name = tweets[j].retweeted_status.user.name;
            text = tweets[j].retweeted_status.text;
            imgLinkT = tweets[j].retweeted_status.user.profile_image_url;
            nRetweets = tweets[j].retweeted_status.retweet_count;
            nLikes = tweets[j].retweeted_status.favorite_count;
            tweetLink = "http://twitter.com/" + tweets[j].retweeted_status.user.screen_name +
                                                    "/status/" + tweets[j].retweeted_status.id_str;
            date = new Date(tweets[j].retweeted_status.created_at);
            date = $filter('date')(date, 'dd MMM yyyy');
          } else{
            author = tweets[j].user.screen_name;
            name = tweets[j].user.name;
            text = tweets[j].text;
            imgLinkT = tweets[j].user.profile_image_url;
            nRetweets = tweets[j].retweet_count;
            nLikes = tweets[j].favorite_count;
            tweetLink = "http://twitter.com/" + tweets[j].user.screen_name +
                                                    "/status/" + tweets[j].id_str;
            date = new Date(tweets[j].created_at);
            date = $filter('date')(date, 'dd MMM yyyy');
          }
          /*text = $scope.parseText(text);*/
          var rted = tweets[j].retweeted;
          var liked = tweets[j].favorited;

          var finalTweet = {'author':author, 'name':name, 'text':text, 'imgLink':imgLinkT,
                            'nRetweets':nRetweets, 'nLikes':nLikes, 'rted':rted,
                            'liked':liked, 'date':date,
                            'tweetLink':tweetLink
                          };
          $scope.panels[index].tweets.push(finalTweet);
        } // End for each tweet
        $scope.panels[index].hasMoreToLoad = tweets.length == $scope.GLOBAL_LOAD_TWEETS;
        $scope.panels[index].loading = false;
      });

    };

    // Call to getAccountPanels
    $scope.getAccountPanels();



  });
