var config = require('./../config/config');
var OAuth = require('oauth').OAuth;
var oa;

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
    if(since_id == -1 || max_id == -1){
        oa.get(
            "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + encodeURIComponent(account) +
            "&count=" + count + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    } else{
        oa.get(
            "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + encodeURIComponent(account) +
            "&count=" + count + "&since_id=" + since_id + "&max_id=" + max_id + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    }
}

function getHome(userToken, userSecret, count, since_id, max_id, callback){
    if(since_id == -1 || max_id == -1){
        oa.get(
            "https://api.twitter.com/1.1/statuses/home_timeline.json?count=" + count
            + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    } else{
        oa.get(
            "https://api.twitter.com/1.1/statuses/home_timeline.json?count=" + count +
            "&since_id=" + since_id + "&max_id=" + max_id + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    }
}

function getMentions(userToken, userSecret, count, since_id, max_id, callback){
    if(since_id == -1 || max_id == -1){
        oa.get(
            "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=" + count
            + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    } else{
        oa.get(
            "https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=" + count +
            "&since_id=" + since_id + "&max_id=" + max_id + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    }
}

function searchHashtag(userToken, userSecret, query, count, since_id, max_id, callback){
    if(since_id == -1 || max_id == -1){
        oa.get(
            "https://api.twitter.com/1.1/search/tweets.json?q=" + encodeURIComponent(query) + "&count=" + count
            + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    } else{
        oa.get(
            "https://api.twitter.com/1.1/search/tweets.json?q=" + encodeURIComponent(query) + "&count=" + count +
            "&since_id=" + since_id + "&max_id=" + max_id + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    }
}

function getMDs(userToken, userSecret, count, since_id, max_id, callback){
    if(since_id == -1 || max_id == -1){
        oa.get(
            "https://api.twitter.com/1.1/direct_messages.json?count=" + count
            + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    } else{
        oa.get(
            "https://api.twitter.com/1.1/direct_messages.json?count=" + count +
            "&since_id=" + since_id + "&max_id=" + max_id + "&trim_user=" + true,
            userToken,
            userSecret,
            function(err,data){
                callback(err,data);
            }
        );
    }
}

function postTweet(userToken, userSecret, tweet, callback){
    oa.post(
        "https://api.twitter.com/1.1/statuses/update.json",
        userToken,
        userSecret,
        {"status" : tweet},
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
    )
}

exports.initTwitter = initTwitterOauth;

exports.getTweetAccount = getTweetAccount;
exports.getTL = getTL;
exports.getHome = getHome;
exports.getMentions = getMentions;
exports.getMDs = getMDs;

exports.searchHashtag = searchHashtag;

exports.postTweet = postTweet;
exports.postMD = postMD;
