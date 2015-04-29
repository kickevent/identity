module.exports = function(AccountModel, UserModel) {

  return {
    create: function() {
      AccountModel.findOne({}, function (err, account) {
        if (!account) {
          account = new AccountModel({
            name: 'default',
            plan: 'free',
            expire: new Date()
          });

          account.save(function() {
            var document = new UserModel({
              username: 'admin',
              password: 'admin',
              email: 'test@kickevent.io',
              roles: ['admin'],
              account: account._id,
              main: true,
              subsribedAt: new Date()
            });
            document.save();
          });

        }
      });
    }
  };
};
