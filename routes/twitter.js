module.exports = function(app,passport){
    
    app.get('/twitter/auth', passport.authenticate('twitter'));

    app.get('/twitter/auth/callback', passport.authenticate('twitter',
        { successRedirect: '/', failureRedirect: '/login' }));

}

