module.exports = function(app,passport){


    /* GET /twitter/home */
    getHomeTLs = function(req,res){
        // Jeje está sin implementar esto FIXME
        var felinoTweetsUserID = req.cookies.user_id;

        
    };



    app.get('/twitter/auth', passport.authorize('twitter', 
        { userAuthorizationURL: 'https://api.twitter.com/oauth/authorize?force_login=true', failureRedirect: '/' }));

    app.get('/twitter/auth/callback', passport.authorize('twitter', 
        { userAuthorizationURL: 'https://api.twitter.com/oauth/authorize?force_login=true', failureRedirect: '/' }),
      function(req, res){


      req.logout();
      req.account = undefined;
      console.log("abracadabra");
      console.log(req.user);
      console.log(req.account);
      console.log(req.cookies);
      console.log(req.params);

      res.redirect('/');
    });

};
