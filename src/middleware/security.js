module.exports = function(securityHeaderName, UserModel, SessionModel, AccountModel, featuresProcessor, limitationsProcessor) {
  return function(req, res, next) {

    if (req.headers[securityHeaderName] !== undefined) {
      var securityHeaderValue = req.get(securityHeaderName);
      SessionModel.findOne({token: securityHeaderValue}, function (err, session) {
        if (!session) {
          req.security = { authenticated: false };
          next();
        } else {
          UserModel.findOne({username: session.username}, function (err, user) {
            if (!user) {
              req.security = { authenticated: false };
              next();
            } else {
              AccountModel.findOne({_id: user.account}, function (err, account) {
                 if (!account) {
                  req.security = { authenticated: false };
                } else {
                  var securityUser = {
                    username: user.username,
                    roles: user.roles,
                    features: featuresProcessor.process(user, account),
                    limitations: limitationsProcessor.process(account),
                    account: user.account
                  };
                  req.security = { authenticated: true, user: securityUser, session: session };
                }
                next();
              });
            }
          });
        }
      });
    } else {
      req.security = { authenticated: false };
      next();
    }
  };
};
