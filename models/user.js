/**
 * Scheme definition for an user
 */
var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var userSchema = new mongoSchema({
    "admin" : Boolean,
    "email" : String,
    "password" : String,
    "first_name" : String,
    "last_name" : String,
    "registration_date" : Date,
    "last_access_date" : Date,
    "hashtags" : { type : Array , "default" : []}
});

module.exports = mongoose.model('user',userSchema);
