const mongoose = require('mongoose');

const iouSchema = new mongoose.Schema({
  iouName: {type: String, required: true},
  iouAmount: {type: Number, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

iouSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Iou', iouSchema);