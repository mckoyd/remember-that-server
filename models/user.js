const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {timestamps: true});

userSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);

