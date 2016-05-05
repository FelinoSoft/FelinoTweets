/**
 * Este fichero es el encargado de enrutar las peticiones a las
 distintas vistas de la aplicacion
 */
var path = require('path');

module.exports = function(app){

  // 'GET /'
  start = function(req, res) {
    res.sendFile(path.resolve('./views/main.html'));
  };

  // 'GET /login'
  login = function(req, res) {
    res.sendFile(path.resolve('./views/login.html'));
  };

  // 'GET /register'
  register = function(req, res) {
    res.sendFile(path.resolve('./views/register.html'));
  };

  // 'GET /home'
  home = function(req, res) {
    res.sendFile(path.resolve('./views/home.html'));
  };

  // 'GET /home/analytics'
  userAnalytics = function(req, res) {
    res.sendFile(path.resolve('./views/userAnalytics.html'));
  };

  // 'GET /admin'
  admin = function(req, res) {
    res.sendFile(path.resolve('./views/admin.html'));
  };

  // 'GET /admin/users'
  adminUsers = function(req, res) {
    res.sendFile(path.resolve('./views/adminUsers.html'));
  };

  // 'GET /admin/analytics'
  adminAnalytics = function(req, res) {
    res.sendFile(path.resolve('./views/adminAnalytics.html'));
  };

  app.get('/', start);
  app.get('/login', login);
  app.get('/register', register);
  app.get('/home', home);
  app.get('/home/analytics', userAnalytics);
  app.get('/admin', admin);
  app.get('/admin/users', adminUsers);
  app.get('/admin/analytics', adminAnalytics);
};
