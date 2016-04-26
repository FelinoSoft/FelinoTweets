/**
 * Scheme definition for a registration
 * (useful for statistics
 */

var mongoose = require('mongoose');

var mongoSchema = mongoose.Schema;

var regSchema = new mongoSchema({
    "type" : String, 
    "date" : Date
});

module.exports = mongoose.model('registration', regSchema);