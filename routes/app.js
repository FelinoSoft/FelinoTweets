/**
 * Este fichero es el encargado de enrutar las peticiones a las
 distintas vistas de la aplicacion
 */
module.exports = function(app){

  redirectTo = function(req, res) {
    var newRoute = '/#' + req.params.url;
    res.redirect(newRoute);
  }

  app.get('/:url', redirectTo);
};
