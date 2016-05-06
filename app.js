/**
 * Este fichero contiene el codigo encargado de lanzar la aplicacion
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');
var databaseAddress = "mongodb://FelinoUser:superfelino1#@ds013310.mlab.com:13310/felinotweetsdb";
var bodyParser = require('body-parser');
var config = require('./config/config');
var database = require('./database.js');
var twitter = require('./twitter');
var session = require('express-session');
//var databaseAddress = 'mongodb://127.0.0.1:27017/felinotweetsdb';

require('./passport')(passport);

var app = express();

app.set('port', (process.env.PORT || config.port));

app.use(express.static(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({secret: 'holaquease', resave:false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.cookieParser());
//app.use(express.session({ secret: "holaquease" }));

// includes different routes
require('./routes/twitter')(app,passport);
require('./routes/users')(app);
require('./routes/twitter_accounts')(app);
require('./routes/urls')(app);
require('./routes/app')(app);

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
