/**
 * Scheme definition for an URL
 * (for the URL shortener)
 */

var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var urlSchema = new mongoSchema({
   "long_url" : String,
    "user" : String,
    "clicks" : Number
});

module.exports = mongoose.model('url',urlSchema);