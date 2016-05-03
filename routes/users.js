/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion users
 */
module.exports = function(app){

    var user = require('../models/user.js');

    /* GET /users */
    findAllUsers = function(req,res){
        var response = {};
        user.find(function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* GET /users/:id */
    findById = function(req,res){
        var response = {};
        user.findById(req.params.id, function(err, data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* POST /users */
    addUser = function(req, res){
        var newUser = new user();
        var response = {};

        // user info
        newUser.admin = req.body.admin;
        newUser.mail = req.body.mail;
        newUser.password = req.body.password;
        newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        newUser.registration_date = req.body.registration_date;
        newUser.last_access_date = req.body.last_access_date;
        newUser.hashtags = req.body.hashtags;

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
    };

    /* DELETE /users */
    deleteAllUsers = function(req,res){
        var response = {};

        user.remove({}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
                res.json(response);
            } else{
                findAllUsers(req,res);
            }

        });
    };

    /* DELETE /users/:id */
    deleteUser = function(req,res){
        var response = {};
        user.findById(req.params.id, function(err,data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                user.remove({_id : req.params.id}, function(err){
                    if(err){
                        response = {"error" : true, "message" : "Error deleting data"};
                        res.json(response);
                    } else{
                        findAllUsers(req,res);
                    }
                });
            }
        });
    };

    app.get('/users', findAllUsers);
    app.get('/users/:id', findById);
    app.post('/users', addUser);
    app.put('/users/:id',updateUser);
    app.delete('/users', deleteAllUsers);
    app.delete('/users/:id',deleteUser);
};
