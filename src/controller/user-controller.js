module.exports = function(_, UserModel, CrudController) {
  var controller = new CrudController(_, UserModel);

  controller.serialize = function(user) {
    return { _id: user._id, username: user.username, account: user.account, roles: user.roles };
  };
  controller.editableProperties = ['roles'];
  controller.getForcedFilters = function(req) {
    return {
      account: req.security.user.account
    };
  };
  controller.createAction = function(req, res) {
    var document = new UserModel(_.extend({ account: req.security.user.account, main: false, subscribedAt: new Date() } , req.body));
    document.save(function(err) {
      if (err) {
        return res.status(500).send({ status: 'error', message : 'mongoose error' });
      }
      return res.send({ status: 'success', data: controller.serialize(document) });
    });
  };
  controller.meAction = function(req, res) {
    res.send(req.security.user);
  };


  return controller;
};
