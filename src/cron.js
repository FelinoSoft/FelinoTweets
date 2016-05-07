var CronJob = require('cron').CronJob;

var minutes = 1000 * 60;
var twitter = require('./twitter');
var tweet = require('../models/scheduled_tweet.js');
var account = require('../models/twitter_account.js');

function initJob() {
    console.log('starting');
    var job = new CronJob({
        cronTime: '01 * * * * 0-6',
        onTick: function () {
            var currentDate = Math.round(Date.now() / minutes);
            console.log('Date ' + currentDate);
            tweet.find(function (err, data) {
                if (!err) {
                    data.forEach(function (e) {
                        if (Math.round(e.date / minutes) == currentDate) {
                            account.findById(e.account_id, function (err, res) {
                                if (!err) {
                                    twitter.postTweet(res.token, res.toke_secret, e.text, function (err, res) {
                                        console.log('Tweet enviado');
                                    });
                                }
                            });
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