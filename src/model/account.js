module.exports = function (mongoose) {
  return mongoose.model('account', {
    name: { type: String, unique: true },
    plan: String,
    expire: Date
  });
};
