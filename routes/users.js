/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion users
 */
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var request = require('request');

var user = require('../models/user.js');
var account = require('../models/twitter_account.js');

var config = require('./../config/config');

// cambiar para subir a heroku
var API = config.API;

module.exports = function(app){

    /* GET /users */
    findAllUsers = function(req,res){
      var response = {};

      // checkUser(req, res, function(err, data) {
      //
      //   if (err) {
      //     response = {"error" : true, "message" : "Error fetching data"};
      //     res.json(response);
      //   } else {
      //
      //     if (data.admin) {
            user.find(function(err,data){
              if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
              } else{
                response = {"error" : false, "message" : data};
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

    /* GET /users/:id */
    findById = function(req,res){
      var response = {};

      checkUser(req, res, function(err, data) {

        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          if (data.admin || data.user_id == req.params.id) {
            user.findById(req.params.id, function(err, data){
              if(err){
                  response = {"error" : true, "message" : "Error fetching data"};
              } else{
                  response = {"error" : false, "message" : data};
              }
              res.json(response);
            });
          }
        }
      });
    };

    /* POST /users */
    addUser = function(req, res){
      var newUser = new user();
      var response = {};

      // user info
      newUser.admin = req.body.admin;
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.first_name = req.body.first_name;
      newUser.last_name = req.body.last_name;
      newUser.registration_date = req.body.registration_date;
      newUser.last_access_date = req.body.last_access_date;
      newUser.hashtags = req.body.hashtags;

      // adds the new user
      newUser.save(function(err){
        if(err){
          response = {"error" : true, "message" : "Error adding data"};
          res.json(response);
        } else {
          findAllUsers(req,res);
        }
      });
    };

    /* PUT /users/:id */
    updateUser = function(req,res){
      var response = {};

      // checks if the user is allowed to edit
      checkUser(req, res, function(err, result) {

        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          var userId = result.user_id;
          var targetId = req.params.id;

          if( (result.admin) || (targetId == userId ) ) {

            user.findById(req.params.id,function(err,data){
                if(req.body.admin !== undefined){
                    data.admin = req.body.admin;
                }
                if(req.body.email !== undefined){
                    data.email = req.body.email;
                }
                if(req.body.first_name !== undefined){
                    data.first_name = req.body.first_name;
                }
                if(req.body.last_name !== undefined){
                    data.last_name = req.body.last_name;
                }
                if(req.body.last_access_date !== undefined){
                    data.last_access_date = req.body.last_access_date;
                }
                if(req.body.hashtags !== undefined){
                    data.hashtags = req.body.hashtags;
                }
                if(req.body.password !== undefined){
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        data.password = hash;
                        data.save(function(err){
                            if(err){
                                response = {"error" : true, "message" : "Error updating data"};
                                res.json(response);
                            } else{
                                if(result.admin){
                                    findAllUsers(req,res);
                                } else{
                                    response = {"error" : false, "message" : data}
                                }
                            }
                        });
                    });
                } else{
                    data.save(function(err){
                        if(err){
                            response = {"error" : true, "message" : "Error updating data"};
                            res.json(response);
                        } else{
                            if(result.admin){
                                findAllUsers(req,res);
                            } else{
                                response = {"error" : false, "message" : data}
                            }
                        }
                    });
                }
            });
          }
          else {

            // user is not admin or password incorrect
            response = {"error" : true, "message" : "Error updating data. Admin permissions required"};
            res.json(response);
          }
        }
      });
    };

    /* DELETE /users */
    deleteAllUsers = function(req,res){
      var response = {};

      // checks if the user is allowed to delete users (admin)
      checkUser(req, res, function(err, data) {
        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          if(data.admin) {
            user.remove({}, function(err){
              if(err){
                  response = {"error" : true, "message" : "Error deleting data"};
                  res.json(response);
              } else{
                  findAllUsers(req,res);
              }
            });
          }
          else {

            // user is not admin
            response = {"error" : true, "message" : "Error deleting data. Admin permissions required"};
            res.json(response);
          }
        }
      });
    };

    /* DELETE /users/:id */
    deleteUser = function(req,res){
      var response = {};

      // checks if the user is allowed to delete users (admin)
      checkUser(req, res, function(err, result) {
        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          var userId = result.user_id;
          var targetId = req.params.id;

          if( (result.admin) || (targetId == userId ) ) {
            user.findById(targetId, function(err,data){
              if(err){
                  response = {"error" : true, "message" : "Error fetching data"};
                  res.json(response);
              } else{

                user.remove({_id : targetId}, function(err){
                  if(err){
                      response = {"error" : true, "message" : "Error deleting data"};
                      res.json(response);
                  } else{

                    // saves delete stat
                    request({
                      uri: API + "/stats/registrations",
                      method: "POST",
                      form: {
                        type: "baja"
                      }
                    });

                    deleteTwitterAccounts(req,res);

                      if(result.admin){
                          // returns all other users left
                          findAllUsers(req,res);
                      } else{
                          response = {"error" : false, "message" : "User deleted"};
                          res.json(response);
                      }
                  }
                });
              }
            });
          }
          else {
            // user is not admin
            response = {"error" : true, "message" : "Error deleting data. Admin permissions required"};
            res.json(response);
          }
        }
      });
    };

    findTwitterAccounts = function(req, res) {
      var response = {};

      // checkUser(req, res, function(err, data) {
      //   if (err) {
      //     response = {"error" : true, "message" : "Error fetching data"};
      //     res.json(response);
      //   } else {
      //
      //     var userId = data.user_id;
          var targetId = req.params.id;
          //
          // if( (data.admin) || (targetId == userId ) ) {
            account.find({"account_id": targetId}, function(err,data){
              if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
              } else{
                response = {"error" : false, "message" : data};
              }
              res.json(response);
            });
        //   }
        //   else {
        //     response = {"error" : true, "message" : "Admin permissions required."};
        //     res.json(response);
        //   }
        // }
      // });
    };

    deleteTwitterAccounts = function(req, res){
        var response = {};

        checkUser(req, res, function(err, result){
            var token = req.headers["authorization"];
            if(err){
                response = {"error": true, "message" : "Error fetching data"};
                res.json(response);
            } else{

                var userId = result.user_id;
                var targetId = req.params.id;

                if( (result.admin) || (targetId == userId ) ) {

                    account.find({"account_id": targetId}, function (err, data) {
                        if (err) {
                            response = {"error": true, "message": "Error fetching data"};
                        } else {
                            data.forEach(function (valor, indice) {
                                request({
                                    uri: API + "/twitter_accounts/" + valor._id,
                                    method: "DELETE",
                                    headers: {'authorization': token}
                                });
                            });
                        }
                    });
                } else{
                    response = {"error" : true, "message" : "Error deleting data. Admin permissions required"};
                    res.json(response);
                }
            }

        });
    };

    login = function(req, res) {
      var response = {};

      // obtains user login info
      var email = req.body.email;
      var pass = req.body.password;

      // checks if the user is already registered
      // and the password matches
      user.findOne({"email" : email}, function(err, data) {
        if (err || data === null) {
          response = {"error" : true, "message" : "Login error"};
          res.json(response);
        }
        else {

          // user registered, now checks the password
          var hash = data.password;
          bcrypt.compare(pass, hash, function(err, result) {
            if (result) {

              // password matches, login succesfull
              data.last_access_date = Date.now();
              data.save(function(err){
                if(err){
                    response = {"error" : true, "message" : "Error updating data"};
                    res.json(response);
                } else{

                  // last_access_date update succesfull

                  // saves login stat
                  request({
                    uri: API + "/stats/registrations",
                    method: "POST",
                    form: {
                      type: "acceso"
                    }
                  });

                  // generates a JSON Web Token (JWT)
                  var userInfo = {
                    "user_id" : data.id,
                    "admin" : data.admin
                  };
                  var token = jwt.sign(userInfo, app.get('superSecret'), {
                    expiresIn: 3600 // expires in 1 hour (3600 secs)
                  });

                  // return the information including token as JSON
                  res.cookie("user_id",data.id);
                  res.json({
                    error: false,
                    message: 'Enjoy your token! (Login succesfull)',
                    token: token
                  });
                }
              });

            }
            else {

              // password doesn't match, login error
              response = {"error" : true, "message" : "Login error"};
              res.json(response);
            }
          });
        }
      });
    };

    register = function(req, res) {
      var response = {};

      // obtains user register info
      var email = req.body.email;
      var first_name = req.body.first_name;
      var last_name = req.body.last_name;

      // checks if the email
      user.findOne({"email" : email}, function(err, data) {
        if (err) {
          response = {"error" : true, "message" : "Fetching error"};
          res.json(response);
        }
        else if (data != undefined) {

          // user is already registered
          response = {"error" : true, "message" : "correo electrónico en uso."};
          res.json(response);
        }
        else {

          // generates random password :D
          randomString(10,function(pass){

              // user not registered, hash the password and inserts it
              bcrypt.hash(pass, 10, function (err, hash) {

                  // creates the new user
                  var newUser = new user();

                  // user info
                  newUser.admin = false;
                  newUser.email = email;
                  newUser.password = hash;
                  newUser.first_name = first_name;
                  newUser.last_name = last_name;
                  newUser.registration_date = Date.now();
                  newUser.last_access_date = newUser.registration_date;
                  newUser.hashtags = req.body.hashtags;
                  newUser.n_tweets = 0;

                  // adds the new user
                  newUser.save(function(err, data){
                      if(err){
                          response = {"error" : true, "message" : "Error registering user"};
                          res.json(response);
                      } else {

                          // register succesfull

                          // saves register stat
                          request({
                            uri: API + "/stats/registrations",
                            method: "POST",
                            form: {
                              type: "alta"
                            }
                          });

                          // generates a JSON Web Token (JWT)
                          var userInfo = {
                              "user_id" : data.id,
                              "admin" : data.admin
                          };
                          var token = jwt.sign(userInfo, app.get('superSecret'), {
                              expiresIn: 3600 // expires in 1 hour (3600 secs)
                          });

                          // return the information including token as JSON
                          res.cookie("user_id",data.id);
                          res.json({
                              error: false,
                              message: 'Enjoy your token! (Register succesfull)',
                              password: pass,
                              token: token
                          });
                      }
                  });
              });
          });
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
    };

    function randomString(length, callback){

      var rnd  = crypto.randomBytes(length)
      , value = new Array(length)
      , chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789"
      , len = chars.length;

      for (var i = 0; i < length; i++){
        value[i] = chars[ rnd[i] % len]
      }

      callback(value.join(''));
    }

    // '/users' methods
    app.get('/users', findAllUsers);
    app.post('/users', addUser);
    app.delete('/users', deleteAllUsers);

    // '/users/:id' methods
    app.get('/users/:id', findById);
    app.put('/users/:id',updateUser);
    app.delete('/users/:id',deleteUser);
    app.get('/users/:id/twitter_accounts', findTwitterAccounts);
    app.delete('/users/:id/twitter_accounts', deleteTwitterAccounts);

    // access control methods
    app.post('/login', login);
    app.post('/register', register);
};
