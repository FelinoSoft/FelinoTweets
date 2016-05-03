var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var server = "mongodb://FelinoUser:superfelino1#@ds013310.mlab.com:13310/felinotweetsdb";
//var server = 'mongodb://127.0.0.1:27017/memoSystem';

var user = require('./models/user');
var twitter_account = require('./models/twitter_account');

/**
 * Database.js
 * Este fichero contiene todas las funciones de llamada a la base de datos
 */

 /**
  * Funcion de coña
  */

function menudosLoles(callback){
	MongoClient.connect(server,function(err,connection){
			if (err) {
				callback(err);
			}

      var collection = connection.collection('loles');

			console.log('--Connected to database');

      collection.insert({'Juajuaja':'hOSTIA k bueno'},
        function(err, count){
					connection.close();
					if(!err) {
						 callback("");
					} else{
						callback(err);
					}
			});
		});
}

function buscarLoles(callback){
	MongoClient.connect(server,function(err,connection){
			if (err) {
				callback(err);
			}

      var collection = connection.collection('loles');

      collection.find().toArray(function(err, documents){
					connection.close();
					if(!err) {
						 callback(documents);
					} else{
						callback(null);
					}
			});
		});
}

function test_user(callback){

    var newUser = new user();
    newUser.admin = true;
    newUser.email = 'test@test.com';
    newUser.password = 'test';
    newUser.first_name = 'test_name';
    newUser.last_name = 'test_last';
    newUser.registration_date = Date.now();
    newUser.last_access_date = Date.now();
    newUser.account = '';

    newUser.save(function(err,user){
       if(!err){
           var newAccount = new user_account();
           newAccount.user_id = user.id;
           newAccount.save(function(err,account){
               if(!err){
                   user.account = account.id;
                   user.save(function(err,inserted){
                       if(!err){
                           console.log(inserted);
                       } else{
                           console.log(err);
                       }
                   });
               } else{
                   console.log('Error 2');
               }
           });
       } else{
           console.log('Error 1');
       }
    });
}

function createTwitterAccount(token, token_secret, profile_id, authorized,callback){
    //TODO: sacar el user_id de las cookies
    var newTwitterAccount = new twitter_account();
    newTwitterAccount.account_id = '57264c6f6da4868c26f53f20';
    newTwitterAccount.token = token;
    newTwitterAccount.token_secret = token_secret;
    newTwitterAccount.profile_id = profile_id.id;
    newTwitterAccount.authorized = authorized;
    newTwitterAccount.save(function(err, data){
       if(!err){
           console.log('Cuenta insertada');
           user_account.findById(ObjectId('572672c1354d7c382da251e7'),function(err,account){
               account.accounts = account.accounts.concat(data.id);
               account.save(function(err,user_ac){
                   if(err){
                       console.log('error');
                   } else{
                       console.log('no_error');
                       callback(err);
                   }
               })
           });


       } else{
           console.log('Cuenta no insertada');
           console.log(err);
       }
    });
}

function getShortenID(callback){
	MongoClient.connect(server,function(err,connection){
			if (err) {
				callback(null);
			}

      var collection = connection.collection('shortenID');
      collection.find().toArray(function(err, documents){
					connection.close();
					if(!err && documents.length > 0) {
						 callback(documents[0].count);
					} else{
						callback(null);
					}
			});
		});
}

function incrementShortenID(callback){
	MongoClient.connect(server, function(err, connection){
		if (err) {
			callback(err);
		}

		var collection = connection.collection('shortenID');

		collection.find().toArray(function(err, documents){
				if(!err && documents.length > 0) {
					 var shortenCount = documents[0].count;
					 var added = shortenCount + 1;
					 collection.update({"count" : shortenCount}, {"count" : added}, {upsert:true}, function(err, result){
						 if(!err){
							 connection.close();
							 callback(null);
						 } else{
							 connection.close();
							 callback(err);
						 }
					 });
				} else{
					connection.close();
					callback(err);
				}
		});
	});
}

exports.menudosLoles = menudosLoles;
exports.buscarLoles = buscarLoles;
exports.incrementShortenID = incrementShortenID;
exports.test_user = test_user;
exports.createTwitterAccount = createTwitterAccount;
exports.getShortenID = getShortenID;
exports.incrementShortenID;
