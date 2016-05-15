/**
 * Scheme definition for a twitter account
 */
var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var twitterSchema = new mongoSchema({
    "account_id" : String,
    "token" : String,
    "token_secret" : String,
    "profile_name" : String,
    "photo_url" : String,
    "description" : String
});

module.exports = mongoose.model('twitter_account',twitterSchema);
