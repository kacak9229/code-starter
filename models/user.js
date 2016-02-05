var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  // email: { type: String, unique: true, lowercase: true},
  socketId: String,
  online: String,
  // twitter: String,
  // facebook: String,
  // instagram: String,
  tokens: Array,
  username: String,
  displayName: String,
  picture: String,

});


module.exports = mongoose.model('User', UserSchema);
