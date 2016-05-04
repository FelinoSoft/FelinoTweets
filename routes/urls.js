/**
 * Este fichero es el encargado de ejecutar la operacion correspondiente a la
 * peticion recibida, para la coleccion urls
 */
module.exports = function(app){

    var url = require('../models/url.js');
    var shortener = require('../src/shortener.js');
    var database = require('../database.js');

    /* GET /url */
    findAllUrls = function(req,res){
        var response = {};
        url.find(function(err,data){
            if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                response = {"error" : false, "message" : data};
            }
            res.json(response);
        });
    };

    /* GET /url/:short_url */
    findById = function(req,res){
        var response = {};
        url.find({"short_url" : req.params.short_url}, function(err, data){
            if(err || data.length == 0){
                response = {"error" : true, "message" : "Error fetching data"};
                res.json(response);
            } else{
                updateClicks(req, function(result){
                  if(result.error){
                    // Hubo error al updatear los clicks
                    response = {"error" : true, "message" : "Error updating clicks"};
                    res.json(response);
                  } else{
                    // No error
                    res.redirect(data[0].long_url);
                  }
                });
            }
        });
    };

    updateClicks = function(req,callback){
        url.find({"short_url" : req.params.short_url},function(err,data){
            if(err || data.length == 0){
              response = {"error" : true, "message" : "Error updating data"};
            } else{
              data[0].clicks = data[0].clicks + 1;
              data[0].save(function(err){
                  if(err){
                      response = {"error" : true, "message" : "Error updating data"};
                  } else{
                      response = {"error" : false, "message" : "Data is updated for " + req.params.short_url};
                  }
                  callback(response);
              });
            }
        });
    };

    /* POST /url */
    addUrl = function(req, res){
        var newUrl = new url();
        var response = {};

        // url info
        database.getShortenID(function(result){
          if(result === null){
            // Error
            response = {"error" : true, "message" : "Error getting shortenID"};
            res.json(response);
          } else{
            // No error
            var num = result;
            database.incrementShortenID(function(err){
              if(err !== null){
                // Error
                response = {"error" : true, "message" : "Error incrementing shortenID"};
                res.json(response);
                console.log(err);
              } else{
                // No error
                newUrl.short_url = shortener.encode(num);
                newUrl.long_url = req.body.long_url;
                newUrl.user_id = req.body.user_id;
                newUrl.clicks = 0;

                newUrl.save(function(err){
                    if(err){
                        response = {"error" : true, "message" : "Error adding data"};
                        res.json(response);
                    } else {
                        findAllUrls(req,res);
                    }
                });
              }
            });
          }
        });
    };

    /* DELETE /url */
    deleteAllUrls = function(req,res){
        var response = {};

        url.remove({}, function(err){
            if(err){
                response = {"error" : true, "message" : "Error deleting data"};
                res.json(response);
            } else{
                findAllUrls(req,res);
            }

        });
    };

    /* DELETE /users/:id */
    deleteUrl = function(req,res){
        var response = {};
        url.find({"short_url" : req.params.short_url}, function(err,data){
            if(err){
                response = {"error" : true, "message" : "Error fetching data"};
            } else{
                url.remove({"short_url" : req.params.short_url}, function(err){
                    if(err){
                        response = {"error" : true, "message" : "Error deleting data"};
                        res.json(response);
                    } else{
                        findAllUrls(req,res);
                    }
                });
            }
        });
    };

    app.get('/url', findAllUrls);
    app.get('/url/:short_url', findById);
    app.post('/url', addUrl);
    app.delete('/url', deleteAllUrls);
    app.delete('/url/:short_url',deleteUrl);
};
