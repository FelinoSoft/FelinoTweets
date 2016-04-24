var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var server = "mongodb://TestUser:testpassword1#@ds013310.mlab.com:13310/felinotweetsdb";
//var server = 'mongodb://127.0.0.1:27017/memoSystem';

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


exports.menudosLoles = menudosLoles;
exports.buscarLoles = buscarLoles;
