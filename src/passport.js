var mongoose = require('mongoose');
var twitter_account = mongoose.model('twitter_account');
// Estrategia de autenticación con Twitter
var TwitterStrategy = require('passport-twitter').Strategy;
// Fichero de configuración donde se encuentran las API keys
// Este archivo no debe subirse a GitHub ya que contiene datos
// que pueden comprometer la seguridad de la aplicación.
var config = require('./../config/config');

// Exportamos como módulo las funciones de passport, de manera que
// podamos utilizarlas en otras partes de la aplicación.
// De esta manera, mantenemos el código separado en varios archivos
// logrando que sea más manejable.
module.exports = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
	// poder utilizarlo
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	// Configuración del autenticado con Twitter
	passport.use(new TwitterStrategy({
		consumerKey		 : config.consumerKey,
		consumerSecret	: config.consumerSecret,
		callbackURL		 : '/twitter/auth/callback',
		userAuthorizationURL: 'https://api.twitter.com/oauth/authenticate?force_login=true',
		passReqToCallback : true
	}, function(req, accessToken, refreshToken, profile, done) {
		// Busca en la base de datos si el usuario ya se autenticó en otro
		// momento y ya está almacenado en ella

		twitter_account.findOne({'profile_name' : profile._json.screen_name, 'account_id': req.cookies.user_id }, function(err, twitter) {
			if(err) throw(err);
			// Si existe en la Base de Datos, lo devuelve
			if(!err && twitter !== null){
				done(null,twitter);
			} else {
				
				// Si no existe crea un nuevo objecto usuario
				var twitterAcc = new twitter_account({
					"account_id": req.cookies.user_id,
					"token": accessToken,
					"token_secret": refreshToken,
					"profile_name": profile._json.screen_name,
					"photo_url": profile._json.profile_image_url,
					"description": profile._json.description
				});
				//...y lo almacena en la base de datos
				twitterAcc.save(function (err, data) {
					if (err) throw err;
					else{
						done(null, data);
					}
				});
			}
		});
	}));
};
