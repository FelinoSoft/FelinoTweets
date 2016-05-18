var twitter = require('./../src/twitter.js');
var twitter_account = require('./../models/twitter_account.js');


module.exports = function(app,passport){

    getTweetAccount = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.getTweetAccount(data.token, data.token_secret, req.query.account, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error obteniendo la cuenta de twitter'};
                    } else{
                        response = {'error' : false, 'message' : data};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    getTimeline = function(req, res){
        var response = {};
        console.log(req.query.id);
        console.log(req.cookies.user_id);
        twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.getTL(data.token, data.token_secret, req.query.account, req.query.count,
                    req.query.since_id, req.query.max_id, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error obteniendo el TL'};
                    } else{
                        var parsed = JSON.parse(data);
                        parsed.push(req.query.id);
                        response = {'error' : false, 'message' : parsed};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    getHome = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.getHome(data.token, data.token_secret, req.query.count,
                    req.query.since_id, req.query.max_id, function(err, data){
                        if(err){
                            response = {'error' : true, 'message' : 'Error obteniendo el TL'};
                        } else{
                            response = {'error' : false, 'message' : data};
                        }
                        res.json(response);
                    });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    getMentions = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.getMentions(data.token, data.token_secret, req.query.count,
                    req.query.since_id, req.query.max_id, function(err, data){
                        if(err){
                            response = {'error' : true, 'message' : 'Error obteniendo las menciones'};
                        } else{
                            response = {'error' : false, 'message' : data};
                        }
                        res.json(response);
                    });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    searchHashtag = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.searchHashtag(data.token, data.token_secret, req.query.hashtag, req.query.count,
                    req.query.since_id, req.query.max_id, function(err, data){
                        if(err){
                            response = {'error' : true, 'message' : 'Error obteniendo los hashtags'};
                        } else{
                            response = {'error' : false, 'message' : data};
                        }
                        res.json(response);
                    });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    getMDs = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.getMDs(data.token, data.token_secret, req.query.count,
                    req.query.since_id, req.query.max_id, function(err, data){
                        if(err){
                            response = {'error' : true, 'message' : 'Error obteniendo los mensajes directos'};
                        } else{
                            response = {'error' : false, 'message' : data};
                        }
                        res.json(response);
                    });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    postTweet = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.body.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.postTweet(req.cookies.user_id, data.token, data.token_secret, req.body.tweet, function(err, data){
                        if(err){
                            response = {'error' : true, 'message' : 'Error enviando el tweet'};
                        } else{
                            response = {'error' : false, 'message' : data};
                        }
                        res.json(response);
                    });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    postMD = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.body.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.postMD(data.token, data.token_secret, req.body.user, req.body.md, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error enviando el mensaje directo'};
                    } else{
                        response = {'error' : false, 'message' : data};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    postRetweet = function(req,res){
        var response = {};
        twitter_account.findOne({'_id' : req.body.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.postRetweet(data.token, data.token_secret, req.body.tweet_id, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error retuiteando'};
                    } else{
                        response = {'error' : false, 'message' : data};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    deleteRetweet = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.body.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.postUnretweet(data.token, data.token_secret, req.body.tweet_id, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error deshaciendo retweet'};
                    } else{
                        response = {'error' : false, 'message' : data};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    postFav = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.body.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.postCreateFav(data.token, data.token_secret, req.body.tweet_id, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error faveando'};
                    } else{
                        response = {'error' : false, 'message' : data};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    deleteFav = function(req, res){
        var response = {};
        twitter_account.findOne({'_id' : req.body.id, 'account_id' : req.cookies.user_id}, function(err,data){
            if(!err){
                twitter.postDeleteFav(data.token, data.token_secret, req.body.tweet_id, function(err, data){
                    if(err){
                        response = {'error' : true, 'message' : 'Error deshaciendo fav'};
                    } else{
                        response = {'error' : false, 'message' : data};
                    }
                    res.json(response);
                });
            } else{
                response = {'error' : true, 'message' : 'Error accediendo a la BD'};
            }
        });
    };

    app.get('/twitter/auth', passport.authenticate('twitter',
        { failureRedirect: '/' }));
    app.get('/twitter/auth/callback', passport.authenticate('twitter',
        { successRedirect: '/', failureRedirect: '/' }));
    app.get('/twitter/tweet_account', getTweetAccount);
    app.get('/twitter/tweetline', getTimeline);
    app.get('/twitter/home', getHome);
    app.get('/twitter/hashtag', searchHashtag);
    app.get('/twitter/mentions', getMentions);
    app.get('/twitter/md', getMDs);
    app.post('/twitter/tweet', postTweet);
    app.post('/twitter/md', postMD);
    app.post('/twitter/retweet', postRetweet);
    app.post('/twitter/unretweet', deleteRetweet);
    app.post('/twitter/fav', postFav);
    app.post('/twitter/unfav', deleteFav);
};
