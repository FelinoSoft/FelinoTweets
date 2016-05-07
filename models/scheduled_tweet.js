/**
 * Scheme definition for a scheduled tweet
 */

var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var tweetSchema = new mongoSchema({
    "user_id" : String,
    "account_id" : String,
    "date" : Date,
    "text" : String
});

module.exports = mongoose.model('scheduled_tweet',tweetSchema);