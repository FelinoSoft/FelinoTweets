module.exports = function(app,passport){


    /* GET /twitter/home */
    getAllTLs = function(req,res){
        // Jeje está sin implementar esto FIXME
    };



    app.get('/twitter/auth', passport.authorize('twitter', { failureRedirect: '/' }));

    app.get('/twitter/auth/callback', passport.authorize('twitter', { failureRedirect: '/' }),
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
