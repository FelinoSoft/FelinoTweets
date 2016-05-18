/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para las estadisticas de la aplicacion
 */
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');

var user = require('../models/user.js');
var account = require('../models/twitter_account.js');
var twitter_account = require('./../models/twitter_account.js');
var registrations = require('../models/registrations.js');

var twitter = require('./../src/twitter.js');

module.exports = function(app){

  /* GET /stats/users/:days */
  findRankingUsers = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {
    //
    //   if (err) {
    //     response = {"error" : true, "message" : "Error fetching data"};
    //     res.json(response);
    //   } else {
    //
    //     if (data.admin) {
          var limit = req.params.limit;
          user.find({}, null, {sort: {n_tweets: -1}, limit: limit}, function(err,resData){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{

              var labels = [];
              var data = [];
              for (var i in resData) {
                var email = resData[i].email;
                var n_tweets = resData[i].n_tweets;

                if (n_tweets == null) {
                  n_tweets = 0;
                }

                labels.push(email);
                data.push(n_tweets);
              }
              var result = {labels, data};
              response = {"error" : false, "message" : result};
            }
            res.json(response);
          });
    //     }
    //     else {
    //       response = {"error" : true, "message" : "Admin permissions required."};
    //       res.json(response);
    //     }
    //   }
    // });
  };

  /* GET /stats/interactions/:id */
  findTweetsMostInteracted = function(req, res) {
    var response = {};
    twitter_account.findOne({'_id' : req.query.id, 'account_id' : req.params.id}, function(err,data){
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
  }

  /* GET /stats/registrations/:days */
  findRegistrations = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {

      // if (err) {
      //   response = {"error" : true, "message" : "Error fetching data"};
      //   res.json(response);
      // } else {

        // if (data.admin) {

          // creates the date to search for
          var days = req.params.days;
          var date = new Date();
          date.setDate(date.getDate() - days);

          registrations.find({date: {$gt: date}}, function(err,resData){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{

              // initializes result set
              var altas = [];
              var bajas = [];
              var accesos = [];
              var labels = [];

              for (var i = days; i >= 0; i--) {
                var newDate = moment().subtract(i, 'days').format('MM-DD');
                var numEvents = 0;
                labels.push(newDate);
                altas.push(numEvents);
                bajas.push(numEvents);
                accesos.push(numEvents);
              }
              var data = {
                'altas': altas,
                'bajas': bajas,
                'accesos': accesos
              };
              var result = {labels, data};

              // checks for date matches to add number of events
              for (var i in resData) {
                var dateReg = moment(resData[i].date).format('MM-DD');
                for (var j in labels) {

                  if (labels[j] == dateReg) {
                    if (resData[i].type == 'alta') {
                      result.data.altas[j] = result.data.altas[j] + 1;
                    }
                    if (resData[i].type == 'baja') {
                      result.data.bajas[j] = result.data.bajas[j] + 1;
                    }
                    if (resData[i].type == 'acceso') {
                      result.data.accesos[j] = result.data.accesos[j] + 1;
                    }
                  }
                }
              }
              response = {"error" : false, "message" : result};
            }
            res.json(response);
          });
        // }
        // else {
        //   response = {"error" : true, "message" : "Admin permissions required."};
        //   res.json(response);
        // }
      // }
    // });
  };

  /* GET /stats/registrations/:type/:days */
  findRegistrationsFiltered = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {

      // if (err) {
      //   response = {"error" : true, "message" : "Error fetching data"};
      //   res.json(response);
      // } else {

        // if (data.admin) {

          // creates the date to search for
          var typeR = req.params.type;
          var days = req.params.days;
          var date = new Date();
          date.setDate(date.getDate() - days);

          registrations.find({type: typeR, date: {$gt: date}}, function(err,resData){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{

              // initializes result set
              var labels = [];
              var events = [];
              for (var i = days; i >= 0; i--) {
                var newDate = moment().subtract(i, 'days').format('MM-DD');
                labels.push(newDate);
                events.push(0);
              }
              var data = {
                'events': events
              };
              var result = {labels, data};

              // checks for date matches to add number of events
              for (var i in resData) {
                var dateReg = moment(resData[i].date).format('MM-DD');
                for (var j in labels) {

                  if (labels[j] == dateReg) {
                      result.data.events[j] = result.data.events[j] + 1;
                  }
                }
              }

              response = {"error" : false, "message" : result};
            }
            res.json(response);
          });
        // }
        // else {
        //   response = {"error" : true, "message" : "Admin permissions required."};
        //   res.json(response);
        // }
      // }
    // });
  };

  /* POST /stats/registrations */
  createRegistration = function(req,res){
    var response = {};
    var newReg = new registrations();

    // checkUser(req, res, function(err, data) {

      // if (err) {
      //   response = {"error" : true, "message" : "Error fetching data"};
      //   res.json(response);
      // } else {

        // if (data.admin) {

          // creates the date to search for
          newReg.type = req.body.type;
          newReg.date = new Date();

          newReg.save(function(err,data){
            if(err) {
              response = {"error" : true, "message" : "Error saving registration"};
            } else{
              response = {"error" : false, "message" : "Registration added."};
            }
            res.json(response);
          });
        // }
        // else {
        //   response = {"error" : true, "message" : "Admin permissions required."};
        //   res.json(response);
        // }
      // }
    // });
  };

  /* GET /stats/activeUsers/:days */
  findActiveUsers = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {

      // if (err) {
      //   response = {"error" : true, "message" : "Error fetching data"};
      //   res.json(response);
      // } else {

        // if (data.admin) {

          // creates the date to search for
          var days = req.params.days;
          var date = new Date();
          date.setDate(date.getDate() - days);

          user.find({last_access_date: {$gt: date}}, function(err,data){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{


              response = {"error" : false, "message" : data.length};
            }
            res.json(response);
          });
        // }
        // else {
        //   response = {"error" : true, "message" : "Admin permissions required."};
        //   res.json(response);
        // }
      // }
    // });
  };

  /* checks if the user is admin or not */
  checkUser = function(req, res, callback) {

    // check header or url parameters or post parameters for token
    var token = req.body.token ||
                req.query.token ||
                req.headers['authorization'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ error: true, message: 'Failed to authenticate token.'});
        } else {

          // if everything is good, save to request for use in other routes
          callback(false, decoded);
        }
      });
    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
          error : true,
          message: 'No token provided.'
      });
    }
  }

  // '/stats' methods for admin
  app.get('/stats/registrations/:days', findRegistrations);
  app.get('/stats/registrations/:type/:days', findRegistrationsFiltered);
  app.post('/stats/registrations', createRegistration);
  app.get('/stats/ranking/:limit', findRankingUsers);
  app.get('/stats/activeUsers/:days', findActiveUsers);

  // '/stats' methods for users
  app.get('/stats/interactions/:id', findTweetsMostInteracted);

};
