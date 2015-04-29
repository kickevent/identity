var container = require('./container');
var express = require('express');
var app = express();

app.use(container.middlewares.bodyParser.json());
app.use(container.middlewares.bodyParser.urlencoded({ extended: true }));
app.use(container.middlewares.security);
app.get('/', function (req, res) {
  res.send('Identity Running ...');
});

// User
app.get('/me', container.middlewares.authentication, container.controllers.userController.meAction);
app.route('/user').all(container.middlewares.authentication, new container.middlewares.authorization(['user-management']));
app.get('/user', container.controllers.userController.findAllAction);
app.get('/user/:id', container.controllers.userController.findOneAction);
app.post('/user', container.controllers.userController.createAction);
app.put('/user/:id', container.controllers.userController.updateAction);
app.delete('/user/:id', container.controllers.userController.removeAction);

// Security
app.post('/login', container.controllers.securityController.loginAction);
app.get('/logout', container.middlewares.authentication, container.controllers.securityController.logoutAction);

// Account
app.get('/account/:name', container.controllers.accountController.findOneAction);
app.post('/account', container.controllers.accountController.createAction);

// Loading Fixtures
container.fixtures.user.create();

// Running
container.mongoose.connect(container.config.db);
app.listen(container.config.port);
console.log('Identity Server running on Port %s', container.config.port);
