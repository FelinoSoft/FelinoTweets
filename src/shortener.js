var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length;

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

module.exports.encode = encode;
module.exports.decode = decode;
