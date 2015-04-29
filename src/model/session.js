module.exports = function (mongoose) {

  var SessionSchema = new mongoose.Schema({
    username: String,
    token: String,
    date: { type: Date, default: Date.now }
  });

  SessionSchema.pre('save', function(next){
    this.date = new Date();
    next();
  });

  return mongoose.model('session', SessionSchema);
};
