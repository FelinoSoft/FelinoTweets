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

// cambiar para subir a heroku
var API = "http://127.0.0.1:8888";

module.exports = function(app){

  /* GET /stats/ranking/tweets */
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

  /* GET /stats/ranking/accounts */
  findRankingAccounts = function(req,res){
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
          user.find(function(err,resData){
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
            } else{

              var labels = [];
              var data = [];
              for (var i in resData) {
                var email = resData[i].email;
                var accounts = 0;

                labels.push(email);
                data.push(accounts);
              }
              var result = {labels, data};

              // obtiene el numero de cuentas para cada usuario
              var usersSaved = 0;
              resData.forEach(function (currentUser, i) {

                var user_id = currentUser._id;
                request({
                  uri: API + '/users/' + user_id + '/twitter_accounts',
                  method: "GET",
                }, function(err, response, body) {
                  if(err) {
                    response = {"error" : true, "message" : "Error fetching data"};
                    res.json(response);
                  } else{

                    var numAccounts = JSON.parse(body).message.length;
                    data[i] = [labels[i], numAccounts];

                    if (usersSaved + 1  == resData.length) {

                      // sorts and filters data array
                      function Comparator(a,b){
                        if (a[1] > b[1]) return -1;
                        if (a[1] < b[1]) return 1;
                        return 0;
                      }
                      data = data.sort(Comparator);

                      // resets labels and data arrays
                      var newData = data;
                      labels = [];
                      data = [];
                      for (var j = 0; j < limit; j++) {
                        labels[j] = newData[j][0];
                        data[j] = newData[j][1];
                      }
                      result = {labels, data};

                      response = {"error" : false, "message" : result};
                      res.json(response);
                    } else {
                      usersSaved = usersSaved + 1;
                    }
                  }
                })
              });
            }
          });
    //     }
    //     else {
    //       response = {"error" : true, "message" : "Admin permissions required."};
    //       res.json(response);
    //     }
    //   }
    // });
  };

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

  /* GET /stats/mentions/:id */
  findMentionsByHour = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {
    //
    //   if (err) {
    //     response = {"error" : true, "message" : "Error fetching data"};
    //     res.json(response);
    //   } else {
    //
    //     if (data.admin) {

          // generate labels for chart
          var labels = [];
          var data = [];
          for (var h = 0; h < 24;h++) {
            if (h < 10) {
              h = '0' + h;
            }
            var date = moment('2016-05-18 ' + h + ':00').format('HH');
            labels.push(date);
          }
          var result = {labels, data};
          var user_id = req.params.id;

          // Busca cuentas de twitter del usuario user_id
          request({
            uri: API + '/users/' + user_id + '/twitter_accounts',
            method: "GET",
          }, function(err, response, body) {
            if(err) {
              response = {"error" : true, "message" : "Error fetching data"};
              res.json(response);
            } else{
              var accounts = JSON.parse(body).message;

              // Para cada cuenta, busca las ultimas 200 menciones
              var accountsSaved = 0;
              accounts.forEach(function(account, i) {

                // inicializa los menciones horarias de una cuenta
                var accountData = [];
                for (var l in labels) {
                  accountData.push(0);
                }
                result.data.push({
                  'name': account.profile_name,
                  'values': accountData
                });
                var idTwitter = account._id;

                request({
                  uri: API + '/twitter/mentions?id=' + idTwitter +
                             '&user_id=' + user_id +
                             '&count=' + 200 +
                             '&since_id=' + -1 +
                             '&max_id=' + -1,
                  method: "GET",
                }, function(err, response, body) {
                  if(err) {
                    response = {"error" : true, "message" : "Error fetching data"};
                    res.json(response);
                  } else{
                    var mentions = JSON.parse(body).message;

                    // Para cada mencion (tweet) suma 1 a la hora de creacion
                    for (j in mentions) {
                      var dateCreation = mentions[j].created_at;
                      dateCreation = moment(new Date(dateCreation)).format('HH');

                      // Para cada hora del dia, comprueba si el tweet se
                      // ha generado a esa hora
                      for (k in labels) {
                        if (dateCreation == labels[k]) {
                          data[i]['values'][k] =
                            data[i]['values'][k] + 1;
                        }
                      }
                    }
                  }

                  if (accountsSaved + 1  == accounts.length) {
                    response = {"error" : false, "message" : result};
                    res.json(response);
                  } else {
                    accountsSaved = accountsSaved + 1;
                  }
                });
              })
            }
          });
          //     }
          //     else {
          //       response = {"error" : true, "message" : "Admin permissions required."};
          //       res.json(response);
          //     }
          //   }
          // });
    }

  /* GET /stats/hashtags/:id */
  findHashtagsByHour = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {
    //
    //   if (err) {
    //     response = {"error" : true, "message" : "Error fetching data"};
    //     res.json(response);
    //   } else {
    //
    //     if (data.admin) {

            // generate labels for chart
            var labels = [];
            var data = [];
            for (var h = 0; h < 24;h++) {
              if (h < 10) {
                h = '0' + h;
              }
              var date = moment('2016-05-18 ' + h + ':00').format('HH');
              labels.push(date);
            }
            var result = {labels, data};
            var user_id = req.params.id;

            // Busca cuentas de twitter del usuario user_id
            request({
              uri: API + '/users/' + user_id + '/twitter_accounts',
              method: "GET",
            }, function(err, response, body) {
              if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
                res.json(response);
              } else{
                var accounts = JSON.parse(body).message;

                // Para cada cuenta, busca las ultimas 200 menciones
                var accountsSaved = 0;
                accounts.forEach(function(account, i) {

                  // inicializa los menciones horarias de una cuenta
                  var accountData = [];
                  for (var l in labels) {
                    accountData.push(0);
                  }
                  result.data.push({
                    'name': account.profile_name,
                    'values': accountData
                  });
                  var idTwitter = account._id;

                  request({
                    uri: API + '/twitter/tweetline?id=' + idTwitter +
                               '&user_id=' + user_id +
                               '&account=' +  account.profile_name +
                               '&count=' + 200 +
                               '&since_id=' + -1 +
                               '&max_id=' + -1,
                    method: "GET",
                  }, function(err, response, body) {
                    if(err) {
                      response = {"error" : true, "message" : "Error fetching data"};
                      res.json(response);
                    } else{
                      var tweets = JSON.parse(body).message;

                      var numTweets = [];
                      for (k in labels) {
                        numTweets.push(0);
                      }

                      // Para cada tweet suma 1 a la hora de creacion si tiene
                      // hashtag
                      for (j in tweets) {
                        var dateCreation = tweets[j].created_at;
                        dateCreation = moment(new Date(dateCreation)).format('HH');

                        // obtains hashtags if available
                        var hashtags = tweets[j].entities.hashtags;

                        // Para cada hora del dia, comprueba si el tweet se
                        // ha generado a esa hora, solo si tiene hashtags

                        for (k in labels) {
                          if (dateCreation == labels[k]) {
                            if (hashtags.length > 0) {
                              data[i]['values'][k] =
                                data[i]['values'][k] + 1;
                            }
                            numTweets[k] = numTweets[k] + 1;
                          }
                        }
                      }

                      // Calcula el porcentaje de tweets con hashtag
                      for (k in labels) {
                        if (numTweets[k] !== 0) {
                          data[i][k] = (data[i][k] / numTweets[k]) * 100;
                        }
                      }
                    }

                    if (accountsSaved + 1  == accounts.length) {
                      response = {"error" : false, "message" : result};
                      res.json(response);
                    } else {
                      accountsSaved = accountsSaved + 1;
                    }
                  });
                })
              }
            });
            //     }
            //     else {
            //       response = {"error" : true, "message" : "Admin permissions required."};
            //       res.json(response);
            //     }
            //   }
    // });
  }

  /* GET /stats/multimedia/:id */
  findMultimediaByHour = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {
    //
    //   if (err) {
    //     response = {"error" : true, "message" : "Error fetching data"};
    //     res.json(response);
    //   } else {
    //
    //     if (data.admin) {

            // generate labels for chart
            var labels = [];
            var data = [];
            for (var h = 0; h < 24;h++) {
              if (h < 10) {
                h = '0' + h;
              }
              var date = moment('2016-05-18 ' + h + ':00').format('HH');
              labels.push(date);
            }
            var result = {labels, data};
            var user_id = req.params.id;

            // Busca cuentas de twitter del usuario user_id
            request({
              uri: API + '/users/' + user_id + '/twitter_accounts',
              method: "GET",
            }, function(err, response, body) {
              if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
                res.json(response);
              } else{
                var accounts = JSON.parse(body).message;

                // Para cada cuenta, busca las ultimas 200 menciones
                var accountsSaved = 0;
                accounts.forEach(function(account, i) {

                  // inicializa los menciones horarias de una cuenta
                  var accountData = [];
                  for (var l in labels) {
                    accountData.push(0);
                  }
                  result.data.push({
                    'name': account.profile_name,
                    'values': accountData
                  });
                  var idTwitter = account._id;

                  request({
                    uri: API + '/twitter/tweetline?id=' + idTwitter +
                               '&user_id=' + user_id +
                               '&account=' +  account.profile_name +
                               '&count=' + 200 +
                               '&since_id=' + -1 +
                               '&max_id=' + -1,
                    method: "GET",
                  }, function(err, response, body) {
                    if(err) {
                      response = {"error" : true, "message" : "Error fetching data"};
                      res.json(response);
                    } else{
                      var tweets = JSON.parse(body).message;

                      var numTweets = [];
                      for (k in labels) {
                        numTweets.push(0);
                      }

                      // Para cada tweet suma 1 a la hora de creacion si tiene
                      // hashtag
                      for (j in tweets) {
                        var dateCreation = tweets[j].created_at;
                        dateCreation = moment(new Date(dateCreation)).format('HH');

                        // obtains hashtags if available
                        var media = tweets[j].entities.media;

                        // Para cada hora del dia, comprueba si el tweet se
                        // ha generado a esa hora, solo si tiene hashtags

                        for (k in labels) {
                          if (dateCreation == labels[k]) {
                            if (media !== undefined) {
                              data[i]['values'][k] =
                                data[i]['values'][k] + 1;
                            }
                            numTweets[k] = numTweets[k] + 1;
                          }
                        }
                      }

                      // Calcula el porcentaje de tweets con hashtag
                      for (k in labels) {
                        if (numTweets[k] !== 0) {
                          data[i][k] = (data[i][k] / numTweets[k]) * 100;
                        }
                      }
                    }

                    if (accountsSaved + 1  == accounts.length) {
                      response = {"error" : false, "message" : result};
                      res.json(response);
                    } else {
                      accountsSaved = accountsSaved + 1;
                    }
                  });
                })
              }
            });
            //     }
            //     else {
            //       response = {"error" : true, "message" : "Admin permissions required."};
            //       res.json(response);
            //     }
            //   }
    // });
  }

  /* GET /stats/retweets/:id */
  findRetweetsByHour = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {
    //
    //   if (err) {
    //     response = {"error" : true, "message" : "Error fetching data"};
    //     res.json(response);
    //   } else {
    //
    //     if (data.admin) {

            // generate labels for chart
            var labels = [];
            var data = [];
            for (var h = 0; h < 24;h++) {
              if (h < 10) {
                h = '0' + h;
              }
              var date = moment('2016-05-18 ' + h + ':00').format('HH');
              labels.push(date);
            }
            var result = {labels, data};
            var user_id = req.params.id;

            // Busca cuentas de twitter del usuario user_id
            request({
              uri: API + '/users/' + user_id + '/twitter_accounts',
              method: "GET",
            }, function(err, response, body) {
              if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
                res.json(response);
              } else{
                var accounts = JSON.parse(body).message;

                // Para cada cuenta, busca las ultimas 200 menciones
                var accountsSaved = 0;
                accounts.forEach(function(account, i) {

                  // inicializa los menciones horarias de una cuenta
                  var accountData = [];
                  for (var l in labels) {
                    accountData.push(0);
                  }
                  result.data.push({
                    'name': account.profile_name,
                    'values': accountData
                  });
                  var idTwitter = account._id;

                  request({
                    uri: API + '/twitter/tweetline?id=' + idTwitter +
                               '&user_id=' + user_id +
                               '&account=' +  account.profile_name +
                               '&count=' + 200 +
                               '&since_id=' + -1 +
                               '&max_id=' + -1,
                    method: "GET",
                  }, function(err, response, body) {
                    if(err) {
                      response = {"error" : true, "message" : "Error fetching data"};
                      res.json(response);
                    } else{
                      var tweets = JSON.parse(body).message;

                      // Para cada tweet suma 1 a la hora de creacion si tiene
                      // hashtag
                      for (j in tweets) {
                        var dateCreation = tweets[j].created_at;
                        dateCreation = moment(new Date(dateCreation)).format('HH');

                        // obtains retweet count
                        var retweets = tweets[j].retweet_count;

                        // Para cada hora del dia, comprueba si el tweet se
                        // ha generado a esa hora, solo si tiene hashtags

                        for (k in labels) {
                          if (dateCreation == labels[k]) {
                            if (tweets[j].retweeted_status === undefined) {
                              data[i]['values'][k] =
                                data[i]['values'][k] + retweets;
                            }
                          }
                        }
                      }
                    }

                    if (accountsSaved + 1  == accounts.length) {
                      response = {"error" : false, "message" : result};
                      res.json(response);
                    } else {
                      accountsSaved = accountsSaved + 1;
                    }
                  });
                })
              }
            });
            //     }
            //     else {
            //       response = {"error" : true, "message" : "Admin permissions required."};
            //       res.json(response);
            //     }
            //   }
    // });
  }

  /* GET /stats/tweets/:id */
  findTweetsByHour = function(req,res){
    var response = {};

    // checkUser(req, res, function(err, data) {
    //
    //   if (err) {
    //     response = {"error" : true, "message" : "Error fetching data"};
    //     res.json(response);
    //   } else {
    //
    //     if (data.admin) {

            // generate labels for chart
            var labels = [];
            var data = [];
            for (var h = 0; h < 24;h++) {
              if (h < 10) {
                h = '0' + h;
              }
              var date = moment('2016-05-18 ' + h + ':00').format('HH');
              labels.push(date);
            }
            var result = {labels, data};
            var user_id = req.params.id;

            // Busca cuentas de twitter del usuario user_id
            request({
              uri: API + '/users/' + user_id + '/twitter_accounts',
              method: "GET",
            }, function(err, response, body) {
              if(err) {
                response = {"error" : true, "message" : "Error fetching data"};
                res.json(response);
              } else{
                var accounts = JSON.parse(body).message;

                // Para cada cuenta, busca las ultimas 200 menciones
                var accountsSaved = 0;
                accounts.forEach(function(account, i) {

                  // inicializa los menciones horarias de una cuenta
                  var accountData = [];
                  for (var l in labels) {
                    accountData.push(0);
                  }
                  result.data.push({
                    'name': account.profile_name,
                    'values': accountData
                  });
                  var idTwitter = account._id;

                  request({
                    uri: API + '/twitter/tweetline?id=' + idTwitter +
                               '&user_id=' + user_id +
                               '&account=' +  account.profile_name +
                               '&count=' + 200 +
                               '&since_id=' + -1 +
                               '&max_id=' + -1,
                    method: "GET",
                  }, function(err, response, body) {
                    if(err) {
                      response = {"error" : true, "message" : "Error fetching data"};
                      res.json(response);
                    } else{
                      var tweets = JSON.parse(body).message;

                      // Para cada tweet suma 1 a la hora de creacion si tiene
                      // hashtag
                      for (j in tweets) {
                        var dateCreation = tweets[j].created_at;
                        dateCreation = moment(new Date(dateCreation)).format('HH');

                        // Para cada hora del dia, comprueba si el tweet se
                        // ha generado a esa hora, solo si tiene hashtags

                        for (k in labels) {
                          if (dateCreation == labels[k]) {
                            if (tweets[j].retweeted_status === undefined) {
                              data[i]['values'][k] =
                                data[i]['values'][k] + 1;
                            }
                          }
                        }
                      }
                    }

                    if (accountsSaved + 1  == accounts.length) {
                      response = {"error" : false, "message" : result};
                      res.json(response);
                    } else {
                      accountsSaved = accountsSaved + 1;
                    }
                  });
                })
              }
            });
            //     }
            //     else {
            //       response = {"error" : true, "message" : "Admin permissions required."};
            //       res.json(response);
            //     }
            //   }
    // });
  }

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
  app.get('/stats/ranking/tweets/:limit', findRankingUsers);
  app.get('/stats/ranking/accounts/:limit', findRankingAccounts);
  app.get('/stats/activeUsers/:days', findActiveUsers);

  // '/stats' methods for users
  app.get('/stats/mentions/:id', findMentionsByHour);
  app.get('/stats/multimedia/:id', findMultimediaByHour);
  app.get('/stats/hashtags/:id', findHashtagsByHour);
  app.get('/stats/retweets/:id', findRetweetsByHour);
  app.get('/stats/tweets/:id', findTweetsByHour);
};
