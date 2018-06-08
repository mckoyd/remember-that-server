const mongoose = require('mongoose');

const uomeSchema = new mongoose.Schema({
  uomeName: {type: String, required: true},
  uomeAmount: {type: Number, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

uomeSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Uome', uomeSchema);