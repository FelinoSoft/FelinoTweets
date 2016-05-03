var cool = require('cool-ascii-faces');

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');

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

app.get('/', function(request, response) {
    response.sendFile(path.resolve('./public/main.html'));
    database.incrementShortenID(function(err){
      
    });
});

app.get('/cool', function(request, response) {
  database.buscarLoles(function(documents){
    response.send(documents);
  });
});

app.get('/loles', function(request, response) {
  database.menudosLoles(function(err){
    response.send(cool());
  });
});


mongoose.connect('mongodb://localhost:27017/felino_tweets',function(err,res){
   if(err){
       console.log('Error conectando a la BD');
   } else{
       console.log('Conectado a la BD');
   }
});



twitter.initTwitter();

//database.test_user();
//database.createTwitterAccount('hola','adios','1');
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
