/**
 * Scheme definition for a twitter account
 */
var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var twitterSchema = new mongoSchema({
    "account_id" : String,
    "description" : String,
    "token" : String,
    "token_secret" : String,
    "profile_id" : String,
    "authorized" : Boolean
});

module.exports = mongoose.model('twitter_account',twitterSchema);
