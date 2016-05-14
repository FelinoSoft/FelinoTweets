module.exports = function(app,passport){

    app.get('/twitter/auth', passport.authorize('twitter', { failureRedirect: '/' }));

    app.get('/twitter/auth/callback', passport.authorize('twitter', { failureRedirect: '/account' }),
      function(req, res){

      console.log("Omg");

      console.log(req.user);
      console.log(req.account);
      console.log(req.cookies);
      console.log(req.params);

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
