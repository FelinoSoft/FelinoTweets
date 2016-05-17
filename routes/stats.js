/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para las estadisticas de la aplicacion
 */
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

var user = require('../models/user.js');
var account = require('../models/twitter_account.js');

module.exports = function(app){

  /* GET /stats/users/:days */
  findRegistersByDate = function(req,res){
    var response = {};

    checkUser(req, res, function(err, data) {

      if (err) {
        response = {"error" : true, "message" : "Error fetching data"};
        res.json(response);
      } else {

        if (data.admin) {

          // creates the date to search for
          var days = req.params.days;
          var date = new Date();
          date.setDate(date.getDate() - days);

          user.find({registration_date: {$gt: date}}, function(err,data){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{
              response = {"error" : false, "message" : data};
            }
            res.json(response);
          });
        }
        else {
          response = {"error" : true, "message" : "Admin permissions required."};
          res.json(response);
        }
      }
    });
  };

  /* GET /stats/users/:days */
  findAccessByDate = function(req,res){
    var response = {};

    checkUser(req, res, function(err, data) {

      if (err) {
        response = {"error" : true, "message" : "Error fetching data"};
        res.json(response);
      } else {

        if (data.admin) {

          // creates the date to search for
          var days = req.params.days;
          var date = new Date();
          date.setDate(date.getDate() - days);

          user.find({last_access_date: {$gt: date}}, function(err,data){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{
              response = {"error" : false, "message" : data};
            }
            res.json(response);
          });
        }
        else {
          response = {"error" : true, "message" : "Admin permissions required."};
          res.json(response);
        }
      }
    });
  };

  /* GET /stats/users/:days */
  findRankingUsers = function(req,res){
    var response = {};

    checkUser(req, res, function(err, data) {

      if (err) {
        response = {"error" : true, "message" : "Error fetching data"};
        res.json(response);
      } else {

        if (data.admin) {
          user.find({}, null, {sort: {n_tweets: -1}}, function(err,data){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{
              response = {"error" : false, "message" : data};
            }
            res.json(response);
          });
        }
        else {
          response = {"error" : true, "message" : "Admin permissions required."};
          res.json(response);
        }
      }
    });
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

  // '/stats' methods
  app.get('/stats/registers/:days', findRegistersByDate);
  app.get('/stats/access/:days', findAccessByDate);
  app.get('/stats/ranking', findRankingUsers);
};
