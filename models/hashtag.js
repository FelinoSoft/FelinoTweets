/**
 * Scheme definition for a scheduled tweet
 */

var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var hashtagSchema = new mongoSchema({
    "user_id" : String,
    "account_id" : String,
    "hashtag" : String
});

module.exports = mongoose.model('hashtag',hashtagSchema);