module.exports = function(AccountModel, UserModel) {
  var controller = {};

  controller.serialize = function(document) {
    return document;
  };

  controller.createAction = function(req, res) {
    var account = new AccountModel({
      name: req.body.name,
      plan: 'free'
    });

    account.save(function() {
      var document = new UserModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        main: true,
        roles: ['admin'],
        account: account._id,
        subsribedAt: new Date()
      });
      document.save();

      return res.send({ status: 'success', data: controller.serialize(account) });
    });

  };

  controller.findOneAction = function (req, res) {
    AccountModel.findOne({ name: req.params.name}, function (err, document) {
      if (err) {
        return res.status(500).send({ status: 'error', message : err });
      }
      if (!document) {
        return res.status(404).send({ status: 'error', message: 'document not found' });
      }
      return res.send({ status: 'success', data: controller.serialize(document) });
    });
  };

  return controller;
};
