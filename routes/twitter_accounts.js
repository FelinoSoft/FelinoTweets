/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion users
 */
module.exports = function(app){

    var account = require('../models/twitter_account.js');
    var tweet = require('../models/scheduled_tweet.js');

    /* GET /twitter_account */
    findAllAccounts = function(req,res){
        var response = {};
        account.find(function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* GET /twitter_account/:id */
    findById = function(req,res){
        var response = {};
        account.findById(req.params.id, function(err, data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* POST /twitter_account */
    addAccount = function(req, res){
        var newAccount = new account();
        var response = {};

        // account info
        newAccount.user_id = req.body.user_id;
        newAccount.token = req.body.token;
        newAccount.token_secret = req.body.token_secret;
        newAccount.profile_id = req.body.profile_id;

        newAccount.save(function(err){
            if(err){
                response = {"error" : true, "message" : "Error adding data"};
                res.json(response);
            } else {
                findAllAccounts(req,res);
            }
        });
    };

    /* PUT /twitter_account/:id */
    updateAccount = function(req,res){
        var response = {};
        account.findById(req.params.id,function(err,data){
            if(req.body.user_id !== undefined){
                data.user_id = req.body.user_id;
            }
            if(req.body.token !== undefined){
                data.token = req.body.token;
            }
            if(req.body.token_secret !== undefined){
                data.token_secret = req.body.token_secret;
            }
            if(req.body.profile_id !== undefined){
                data.profile_id = req.body.profile_id;
            }

            data.save(function(err){
                if(err){
                    response = {"error" : true, "message" : "Error updating data"};
                } else{
                    response = {"error" : false, "message" : "Data is updated for " + req.params.id};
                }
                res.json(response);
            });
        });
    };

    /* DELETE /twitter_account */
    deleteAllAccounts = function(req,res){
        var response = {};

        account.remove({}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
                res.json(response);
            } else{
                findAllAccounts(req,res);
            }

        });
    };

    /* DELETE /twitter_account/:id */
    deleteAccount = function(req,res){
        var response = {};
        account.findById(req.params.id, function(err,data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                account.remove({_id : req.params.id}, function(err){
                    if(err){
                        response = {"error" : true, "message" : "Error deleting data"};
                        res.json(response);
                    } else{
                        findAllAccounts(req,res);
                    }
                });
            }
        });
    };

    findAllScheduledTweets = function(req,res){
        var response = {};
        tweet.find({'account_id' : req.params.id}, function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    findScheduledTweetById = function(req,res){
        var response = {};
        tweet.find({'account_id' : req.params.id, '_id' : req.params.tweet_id}, function(err, data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };
    
    addTweet = function(req,res){
        var newTweet = new tweet();
        var response = {};

        //TODO: leer token para cuenta del usuario
        newTweet.user_id = 'temp';
        newTweet.account_id = req.params.id;
        newTweet.date = req.body.date;
        newTweet.text = req.body.text;

        newTweet.save(function(err){
            if(err){
                response = {"error" : true, "message" : "Error adding data"};
                res.json(response);
            } else {
                findAllScheduledTweets(req,res);
            }
        });
    };
    
    updateTweet = function(req, res){
        var response = {};
        tweet.find({'account_id' : req.params.id, '_id' : req.params.tweet_id}, function(err, data){
            if(req.body.date !== undefined){
                data.date = req.body.date;
            }
            if(req.body.text !== undefined){
                data.text = req.body.text;
            }

            data.save(function(err){
                if(err){
                    response = {"error" : true, "message" : "Error updating data"};
                    res.json(response);
                } else{
                    findAllScheduledTweets(req,res);
                }
            });
        });
    };

    deleteTweet = function(req,res){
        var response = {};
        tweet.remove({'account_id' : req.params.id, '_id' : req.params.tweet_id}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
                res.json(response);
            } else{
                findAllScheduledTweets(req,res);
            }
        });
    };

    deleteAllTweets = function(req, res){
        var response = {};
        tweet.remove({'account_id' : req.params.id}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
                res.json(response);
            } else{
                findAllScheduledTweets(req,res);
            }
        });
    };
    
    



    app.get('/twitter_accounts', findAllAccounts);
    app.get('/twitter_accounts/:id', findById);
    app.post('/twitter_accounts', addAccount);
    app.put('/twitter_accounts/:id',updateAccount);
    app.delete('/twitter_accounts', deleteAllAccounts);
    app.delete('/twitter_accounts/:id',deleteAccount);

    app.get('/twitter_accounts/:id/scheduled_tweets', findAllScheduledTweets);
    app.get('/twitter_accounts/:id/scheduled_tweets/:tweet_id', findScheduledTweetById);
    app.post('/twitter_accounts/:id/scheduled_tweets', addTweet);
    app.put('/twitter_accounts/:id/scheduled_tweets/:tweet_id', updateTweet);
    app.delete('/twitter_accounts/:id/scheduled_tweets', deleteAllTweets);
    app.delete('/twitter_accounts/:id/scheduled_tweets/:tweet_id', deleteTweet);
};
