var homeModule = angular.module('homeModule', [
  'felinotweetsApp',
  'infinite-scroll'
]);

  homeModule.controller('homeController',
    function($http,$scope,$filter,auth,twitter,home){
    console.log("homeController inicializado");

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
          home.getAccountTimeLine(twAccs[i]._id, twAccs[i].profile_name, 20, -1, -1).then(function(result){
            console.log(result);
            var mongoID = result.data.message.pop();
            var tweets = result.data.message;
            var panelTweets = [];
            var user = tweets[0].user.screen_name;
            var desc = tweets[0].user.description;
            var imgLink = tweets[0].user.profile_image_url;
            var maxID;
            console.log(tweets);
            for(j = 0; j < tweets.length; j++){
              if(j == tweets.length - 1){
                maxID = tweets[j].id;
              }
              var author;
              var text;
              var imgLinkT;
              var nRetweets;
              var nLikes;
              var tweetLink;
              var date;
              var day;
              var month;
              var year;
              if(tweets[j].retweeted){
                author = tweets[j].retweeted_status.user.screen_name;
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
                text = tweets[j].text;
                imgLinkT = tweets[j].user.profile_image_url;
                nRetweets = tweets[j].retweet_count;
                nLikes = tweets[j].favorite_count;
                tweetLink = "http://twitter.com/" + tweets[j].user.screen_name +
                                                        "/status/" + tweets[j].id_str;
                date = new Date(tweets[j].created_at);
                date = $filter('date')(date, 'dd MMM yyyy');
              }
              var rted = tweets[j].retweeted;
              var liked = tweets[j].favorited;

              var finalTweet = {'author':author, 'text':text, 'imgLink':imgLinkT,
                                'nRetweets':nRetweets, 'nLikes':nLikes, 'rted':rted,
                                'liked':liked, 'date':date,
                                'tweetLink':tweetLink
                              };
              panelTweets.push(finalTweet);
            } // End for each tweet
            var panel = {'user':user, 'desc':desc, 'imgLink':imgLink, 'tweets':panelTweets,
                        'mongoID':mongoID, 'deleting':false};
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

      var boo = 'far';
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

    // Call to getAccountPanels
    $scope.getAccountPanels();

  });
