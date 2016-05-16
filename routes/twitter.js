var twitter = require('./../src/twitter.js');

module.exports = function(app,passport){
    
    getTweetAccount = function(req, res){
        
    }



    app.get('/twitter/auth', passport.authenticate('twitter',
        { userAuthorizationURL: 'https://api.twitter.com/oauth/authorize?force_login=true', failureRedirect: '/' }));

    app.get('/twitter/auth/callback', passport.authenticate('twitter',
        { successRedirect: '/', failureRedirect: '/' }));
    
    
    
};
