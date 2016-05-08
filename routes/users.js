/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion users
 */
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

module.exports = function(app){

    var user = require('../models/user.js');

    /* GET /users */
    findAllUsers = function(req,res){
      var response = {};

      checkUser(req, res, function(err, data) {

        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          if (data.admin) {
            user.find(function(err,data){
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
      checkUser(req, res, function(err, data) {

        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          var userId = data.user_id;
          var targetId = req.params.id;

          if( (data.admin) || (targetId == userId ) ) {

            user.findById(req.params.id,function(err,data){
                if(req.body.admin !== undefined){
                    data.admin = req.body.admin;
                }
                if(req.body.email !== undefined){
                    data.email = req.body.email;
                }
                if(req.body.password !== undefined){
                    data.password = req.body.password;
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

                data.save(function(err){
                  if(err){
                      response = {"error" : true, "message" : "Error updating data"};
                  } else{
                      response = {"error" : false, "message" : "Data is updated for " + req.params.id};
                  }
                  res.json(response);
                });
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
    }

    /* DELETE /users/:id */
    deleteUser = function(req,res){
      var response = {};

      // checks if the user is allowed to delete users (admin)
      checkUser(req, res, function(err, data) {
        if (err) {
          response = {"error" : true, "message" : "Error fetching data"};
          res.json(response);
        } else {

          var userId = data.user_id;
          var targetId = req.params.id;

          if( (data.admin) || (targetId == userId ) ) {
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
                      findAllUsers(req,res);
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
    }

    login = function(req, res) {
      var response = {};

      // obtains user login info
      var email = req.body.email;
      var pass = req.body.password;

      // checks if the user is already registered
      // and the password matches
      user.findOne({"email" : email}, function(err, data) {
        if (err || data == null) {
          response = {"error" : true, "message" : "Login error"};
          res.json(response);
        }
        else {

          // user registered, now checks the password
          var hash = data.password;
          bcrypt.compare(pass, hash, function(err, result) {
            if (result) {

              // password matches, login succesfull
              // generates a JSON Web Token (JWT)
              var userInfo = {
                "user_id" : data.id,
                "admin" : data.admin
              };
              var token = jwt.sign(userInfo, app.get('superSecret'), {
                expiresIn: 60 // expires in 1 hour (3600 secs)
              });

              // return the information including token as JSON
              res.json({
                error: false,
                message: 'Enjoy your token! (Login succesfull)',
                token: token
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
          response = {"error" : true, "message" : "Email already in use"};
          res.json(response);
        }
        else {

          // generates random password :D
          var pass = "random";

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

            // adds the new user
            newUser.save(function(err, data){
              if(err){
                response = {"error" : true, "message" : "Error registering user"};
                res.json(response);
              } else {

                // register succesfull
                // generates a JSON Web Token (JWT)
                var userInfo = {
                  "user_id" : data.id,
                  "admin" : data.admin
                };
                var token = jwt.sign(userInfo, app.get('superSecret'), {
                  expiresIn: 60 // expires in 1 hour (3600 secs)
                });

                // return the information including token as JSON
                res.json({
                  error: false,
                  message: 'Enjoy your token! (Register succesfull)',
                  token: token
                });
              }
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
    }

    // '/users' methods
    app.get('/users', findAllUsers);
    app.post('/users', addUser);
    app.delete('/users', deleteAllUsers);

    // '/users/:id' methods
    app.get('/users/:id', findById);
    app.put('/users/:id',updateUser);
    app.delete('/users/:id',deleteUser);

    // '/login' methods
    app.post('/login', login);

    // '/register' methods
    app.post('/register', register);
};
