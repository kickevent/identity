module.exports = function (mongoose) {
  return mongoose.model('user', {
    username: { type: String, unique: true },
    password: String,
    email: String,
    roles: Array,
    main: Boolean,
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    subscribedAt: Date
  });
};
