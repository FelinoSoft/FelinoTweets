/**
 * Este fichero es el encargado de enrutar las peticiones a las
 distintas vistas de la aplicacion
 */
module.exports = function(app){

  redirectTo = function(req, res) {
    var newRoute = "";
    if(req.params.url == "twitter/auth"){
      console.log("paque");
      newRoute = req.params.url;
    } else{
      newRoute = '/#' + req.params.url;
    }
    res.redirect(newRoute);
  };

  app.get('/:url', redirectTo);
};
