/**
 * Este fichero es el encargado de enrutar las peticiones a las
 distintas vistas de la aplicacion
 */
module.exports = function(app){

  redirectTo = function(req, res) {
    var newRoute = "";
    if(req.path == "/twitter/auth"){
      newRoute = req.path;
    } else{
      newRoute = '/#' + req.path;
    }
    res.redirect(newRoute);
  };

  app.get('/*', redirectTo);
};
