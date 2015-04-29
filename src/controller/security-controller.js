module.exports = function(uuid, UserModel, SessionModel) {

  return {
    loginAction: function(req, res) {
      UserModel.findOne({username: req.body.username, password: req.body.password, account: req.body.account}, function (err, user) {
        if (!user) {
          return res.status(401).send({ status: 'error', message: 'Invalid credentials' });
        }
        var document = new SessionModel({
          username: user.username,
          token: uuid.v1()
        });
        document.save(function(err) {
          if (err) {
            return res.status(500).send({ status: 'error', message : 'mongoose error' });
          }
          return res.send({ token: document.token });
        });
      });
    },

    logoutAction: function(req, res) {
      req.security.session.remove(function(err) {
        if (err) {
          return res.status(500).send({ status: 'error', message : 'mongoose error' });
        }
        return res.send({ status: 'success', message: 'Logout success' });
      });
    }
  };
};
