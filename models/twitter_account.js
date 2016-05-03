/**
 * Scheme definition for a twitter account
 */
var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var twitterSchema = new mongoSchema({
    "user_id" : String,
    "token" : String,
    "token_secret" : String,
    "profile_id" : String
});

module.exports = mongoose.model('twitter_account',twitterSchema);