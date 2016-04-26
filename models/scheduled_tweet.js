/**
 * Scheme definition for a scheduled tweet
 */

var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var tweetSchema = new mongoSchema({
    "user" : String,
    "account" : String,
    "date" : Date,
});

module.exports = mongoose.model('scheduled_tweet',tweetSchema);