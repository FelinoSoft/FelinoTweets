var CronJob = require('cron').CronJob;

var minutes = 1000 * 60;
//var twitter = require('./twitter');
var tweet = require('../models/scheduled_tweet.js');
var account = require('../models/twitter_account.js');

function initJob(twitter) {
    console.log('Starting cron');
    var job = new CronJob({
        cronTime: '01 * * * * 0-6',
        onTick: function () {
            var currentDate = Math.round(Date.now() / minutes);
            tweet.find(function (err, data) {
                if (!err) {
                    data.forEach(function (e) {
                        if (Math.round(e.date / minutes) <= currentDate){
                            account.findById(e.account_id, function (err, res) {
                                if (!err) {
                                    twitter.postTweet(e.user_id, res.token, res.token_secret, e.text, function (err, result) {
                                        if(!err) {
                                            tweet.remove({'_id': e._id}, function (err, res) {
                                            });
                                        }
                                    });
                                }
                            });
                        } else{
                        }
                    });
                }
            });
        },
        start: false,
        timeZone: 'Europe/Madrid'
    });
    job.start();
}

exports.initJob = initJob;