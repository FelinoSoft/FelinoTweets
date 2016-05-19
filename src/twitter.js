var config = require('./../config/config');
var OAuth = require('oauth').OAuth;
var oa;
var user = require('../models/user.js');

function initTwitterOauth(){
    oa = new OAuth(
      "https://twitter.com/oauth/request_token",
      "https://twitter.com/oauth/access_token",
      config.consumerKey,
      config.consumerSecret,
      "1.0A",
      "http://" + config.domain + ":" + config.port + "/twitter/auth/callback",
      "HMAC-SHA1"
    );
}

function getTweetAccount(userToken, userSecret, account, callback){
    oa.get(
      "https://api.twitter.com/1.1/users/show.json?screen_name=" + encodeURIComponent(account),
      userToken,
      userSecret,
      //{"screen_name" : account},
        function(err,data){
            callback(err,data);
        }
    );
}

function getTL(userToken, userSecret, account, count, since_id, max_id, callback){
    var part = "";
    if(since_id != -1){
        part = part + "&since_id=" + since_id;
    }
    if(max_id != -1){
        part = part + "&max_id=" +  max_id;
    }
    oa.get(
        "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + encodeURIComponent(account) +
        "&count=" + count + part,
        userToken,
        userSecret,
        function(err,data){
            callback(err,data);
        }
    );
}

function getHome(userToken, userSecret, count, since_id, max_id, callback){
  var part = "";
  if(since_id != -1){
      part = part + "&since_id=" + since_id;
  }
  if(max_id != -1){
      part = part + "&max_id=" +  max_id;
  }
  oa.get(
      "https://api.twitter.com/1.1/statuses/home_timeline.json?count=" + count +
      part,
      userToken,
      userSecret,
      function(err,data){
          callback(err,data);
      }
  );
}

function getMentions(userToken, userSecret, count, since_id, max_id, callback){
    var part = "";
    if(since_id != -1){
        part = part + "&since_id=" + since_id;
    }
    if(max_id != -1){
        part = part + "&max_id=" +  max_id;
    }
    oa.get(
        "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=" + count +
        part,
        userToken,
        userSecret,
        function(err,data){
            callback(err,data);
        }
    );
}

function searchHashtag(userToken, userSecret, query, count, since_id, max_id, callback){
    var part = "";
    if(since_id != -1){
        part = part + "&since_id=" + since_id;
    }
    if(max_id != -1){
        part = part + "&max_id=" +  max_id;
    }
    oa.get(
        "https://api.twitter.com/1.1/search/tweets.json?q=" + encodeURIComponent(query) + "&count=" + count +
        part,
        userToken,
        userSecret,
        function(err,data){
            callback(err,data);
        }
    );
}

function getMDs(userToken, userSecret, count, since_id, max_id, callback){
    if(since_id == -1 || max_id == -1){
        oa.get(
            "https://api.twitter.com/1.1/direct_messages.json?count=" + count +
            "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    } else{
        oa.get(
            "https://api.twitter.com/1.1/direct_messages.json?count=" + count +
            "&since_id=" + since_id + "&max_id=" + max_id,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    }
}

function postTweet(userID, userToken, userSecret, tweet, callback, id_reply){


    options = {
        "status" : tweet
    };
    if(id_reply !== undefined){
        options.in_reply_to_status_id = id_reply;
    }

    oa.post(
        "https://api.twitter.com/1.1/statuses/update.json",
        userToken,
        userSecret,
        options,
        function(err,data){
            if(!err){
                user.findByIdAndUpdate(userID, {$inc: {n_tweets : 1}}, function(err){
                    callback(err,data);
                });
            } else{
                callback(err,data);
            }
        }
    );
}

function postRetweet(userToken, userSecret, tweet_ID, callback) {
    oa.post(
        "https://api.twitter.com/1.1/statuses/retweet/" + tweet_ID + ".json",
        userToken,
        userSecret,
        {},
        function(err,data){
            callback(err,data);
        }
    );
}

function postUnretweet(userToken, userSecret, tweet_ID, callback) {
    oa.post(
        "https://api.twitter.com/1.1/statuses/unretweet/" + tweet_ID + ".json",
        userToken,
        userSecret,
        {},
        function(err,data){
            callback(err,data);
        }
    );
}

function postCreateFav(userToken, userSecret, tweet_ID, callback) {
    oa.post(
        "https://api.twitter.com/1.1/favorites/create.json",
        userToken,
        userSecret,
        {"id" : tweet_ID},
        function(err,data){
            callback(err,data);
        }
    );
}

function postDeleteFav(userToken, userSecret, tweet_ID, callback) {
    oa.post(
        "https://api.twitter.com/1.1/favorites/destroy.json",
        userToken,
        userSecret,
        {"id" : tweet_ID},
        function(err,data){
            callback(err,data);
        }
    );
}

function postMD(userToken, userSecret, user, md, callback){
    oa.post(
        "https://api.twitter.com/1.1/direct_messages/new.json",
        userToken,
        userSecret,
        {"screen_name" : user,
            "text" : md },
        function(err,data){
            callback(err,data);
        }
    );
}

exports.initTwitter = initTwitterOauth;

exports.getTweetAccount = getTweetAccount;
exports.getTL = getTL;
exports.getHome = getHome;
exports.getMentions = getMentions;
exports.getMDs = getMDs;

exports.searchHashtag = searchHashtag;

exports.postTweet = postTweet;
exports.postRetweet = postRetweet;
exports.postUnretweet = postUnretweet;
exports.postCreateFav = postCreateFav;
exports.postDeleteFav = postDeleteFav;
exports.postMD = postMD;
