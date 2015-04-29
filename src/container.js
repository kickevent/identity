//Vendor
var _ = require('lodash');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var bodyParser = require('body-parser');

// Config
var config            = require('./config/config');
var configFeatures    = require('./config/features');
var configLimitations = require('./config/limitations');

// Mongo
var UserModel    = require('./model/user')(mongoose);
var SessionModel = require('./model/session')(mongoose);
var AccountModel = require('./model/account')(mongoose);

// Features
var FeaturesProcessor = require('./processors/features');
var LimitationsProcessor = require('./processors/limitations');
var featuresProcessor = new FeaturesProcessor(_, configFeatures);
var limitationsProcessor = new LimitationsProcessor(configLimitations);

// Middlewares
var AuthenticationMiddleware = require('./middleware/authentication');
var AuthorizationMiddleware = require('./middleware/authorization');
var SecurityMiddleware = require('./middleware/security');
var middlewares = {
  authentication: new AuthenticationMiddleware(),
  security: new SecurityMiddleware(config.securityTokenName, UserModel, SessionModel, AccountModel, featuresProcessor, limitationsProcessor),
  authorization: AuthorizationMiddleware,
  bodyParser: bodyParser
};

// Fixtures
var UserData = require('./fixtures/user-data');
var fixtures = {
  user: new UserData(AccountModel, UserModel)
};

// Controllers
var CrudController = require('./controller/crud-controller');
var UserController = require('./controller/user-controller');
var AccountController = require('./controller/account-controller');
var SecurityController = require('./controller/security-controller');
var controllers = {
  userController: new UserController(_, UserModel, CrudController),
  securityController: new SecurityController(uuid, UserModel, SessionModel),
  accountController: new AccountController(AccountModel, UserModel)
};

module.exports = {
  middlewares: middlewares,
  controllers: controllers,
  fixtures: fixtures,
  mongoose: mongoose,
  config: config
};
