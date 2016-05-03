var config = require('./config/config');
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

function makeTweet(userToken, userSecret, tweet, callback){
    oa.post(
      "https://api.twitter.com/1.1/statuses/update.json",
      userToken,
      userSecret,
      {"status" : tweet},
      callback()
    );
}

exports.initTwitter = initTwitterOauth;
exports.makeTweet = makeTweet;