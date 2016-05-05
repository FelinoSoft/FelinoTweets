/**
 * Este fichero es el encargado de enrutar las peticiones a las
 distintas vistas de la aplicacion
 */
var path = require('path');

module.exports = function(app){

  // 'GET /'
  start = function(req, res) {

    // checks if user is logged in, in this case it redirects
    // to '/home'
    if (req.session.user_id != undefined) {
      response = {"error" : false, "message" : {"redirect" : "/home"} };
      res.json(response);
    }
    else {
      res.sendFile(path.resolve('./views/main.html'));
    }
  };

  // 'GET /login'
  login = function(req, res) {

    // checks if user is logged in, in this case it redirects
    // to '/home'
    if (req.session.user_id != undefined) {
      response = {"error" : false, "message" : {"redirect" : "/home"} };
      res.json(response);
    }
    else {
      res.sendFile(path.resolve('./views/login.html'));
    }
  };

  // 'GET /register'
  register = function(req, res) {

    // checks if user is logged in, in this case it redirects
    // to '/home'
    if (req.session.user_id != undefined) {
      response = {"error" : false, "message" : {"redirect" : "/home"} };
      res.json(response);
    }
    else {
      res.sendFile(path.resolve('./views/register.html'));
    }
  };

  // 'GET /home'
  home = function(req, res) {

    // checks if user is not logged in, in this case it redirects
    // to '/login'
    if (req.session.user_id == undefined) {
      response = {"error" : false, "message" : {"redirect" : "/login"} };
      res.json(response);
    }
    else {
      res.sendFile(path.resolve('./views/home.html'));
    }
  };

  // 'GET /home/analytics'
  userAnalytics = function(req, res) {

    // checks if user is not logged in, in this case it redirects
    // to '/login'
    if (req.session.user_id == undefined) {
      response = {"error" : false, "message" : {"redirect" : "/login"} };
      res.json(response);
    }
    else {
      res.sendFile(path.resolve('./views/userAnalytics.html'));
    }
  };

  // 'GET /admin'
  admin = function(req, res) {

    // checks if user is not logged in, in this case it redirects
    // to '/login', if it is logged checks if it is admin
    if (req.session.user_id == undefined) {
      response = {"error" : false, "message" : {"redirect" : "/login"} };
      res.json(response);
    }
    else if (!req.session.admin) {

      // admin permissions required
      response = {"error" : false, "message" : {"redirect" : "/home"} };
      res.json(response);
    }
    else {

      // shows admin main view
      res.sendFile(path.resolve('./views/admin.html'));
    }
  };

  // 'GET /admin/users'
  adminUsers = function(req, res) {

    // checks if user is not logged in, in this case it redirects
    // to '/login', if it is logged checks if it is admin
    if (req.session.user_id == undefined) {
      response = {"error" : false, "message" : {"redirect" : "/login"} };
      res.json(response);
    }
    else if (!req.session.admin) {

      // admin permissions required
      response = {"error" : false, "message" : {"redirect" : "/home"} };
      res.json(response);
    }
    else {

      // shows admin users view
      res.sendFile(path.resolve('./views/adminUsers.html'));
    }
  };

  // 'GET /admin/analytics'
  adminAnalytics = function(req, res) {
    // checks if user is not logged in, in this case it redirects
    // to '/login', if it is logged checks if it is admin
    if (req.session.user_id == undefined) {
      response = {"error" : false, "message" : {"redirect" : "/login"} };
      res.json(response);
    }
    else if (!req.session.admin) {

      // admin permissions required
      response = {"error" : false, "message" : {"redirect" : "/home"} };
      res.json(response);
    }
    else {

      // shows admin analytics view
      res.sendFile(path.resolve('./views/adminAnalytics.html'));
    }
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
