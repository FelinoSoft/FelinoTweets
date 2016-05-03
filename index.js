/**
 * Este fichero contiene el codigo encargado de lanzar la aplicacion 
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');
var databaseAddress = "mongodb://FelinoUser:superfelino1#@ds013310.mlab.com:13310/felinotweetsdb";

var config = require('./config/config');
var database = require('./database.js');
var twitter = require('./twitter');

require('./passport')(passport);

var app = express();

app.set('port', (process.env.PORT || config.port));

app.use(express.static(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('express-session')({secret: 'keyboard cat', resave:true, saveUnitializated: true}));
app.use(passport.initialize());
app.use(passport.session());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.use(express.cookieParser());
//app.use(express.session({ secret: "holaquease" }));

// includes different routes
require('./routes/twitter')(app,passport);
require('./routes/users')(app);
require('./routes/twitter_accounts')(app);
require('./routes/urls')(app);
//require('./routes/app')(app);

mongoose.connect(databaseAddress,function(err,res){
   if(err){
       console.log('Error conectando a la BD');
   } else{
       console.log('Conectado a la BD');
   }
});

// initialize twitter data
twitter.initTwitter();

// initialize server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
