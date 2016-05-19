var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length;
var request = require('request');
/**
 * Funcion para convertir un entero en un codigo en base58 unico
 */
function encode(num){
  var encoded = '';
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}

function decode(code){
  var decoded = 0;
  while (code){
    var index = alphabet.indexOf(code[0]);
    var power = code.length - 1;
    decoded += index * (Math.pow(base, power));
    str = code.substring(1);
  }
  return decoded;
}

function parseText(user_id, text, callback){

    var countURLs = function(text){
      var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

      var match = urlRegex.exec(text);

      var count = 0;

      while(match !== null){
        count++;
        match = urlRegex.exec(text);
      }

      return count;
    };

    var count = countURLs(text);

    var remplaceRegex = function (user_id,url,text, callback){
      request({
        uri: "http://127.0.0.1:8888/url/",
        method: "POST",
        form: {
          user_id: user_id,
          long_url: url[0]
        }
      }, function(error, response, body){
        var index;
        body = JSON.parse(body);
        var i = body.message.length - 1;
        var found = false;
        while(i >= 0 && !found){
          if(body.message[i].long_url == url[0]){
            index = i;
            found = true;
          } else{
            i++;
          }
        }
        callback(text.replace(url[0],'felino.tk/url/' + body.message[index].short_url));
      });
    };

    (function next(num_url,texto){
      if(num_url == count){
        callback(texto);
        return;
      }
      var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      var match = urlRegex.exec(texto);
      remplaceRegex(user_id,match,texto,function(texto){
        num_url = num_url + 1;
        next(num_url, texto);
      });
    })(0,text);
}

module.exports.encode = encode;
module.exports.decode = decode;
module.exports.parseText = parseText;
