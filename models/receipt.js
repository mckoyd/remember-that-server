const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  vendorName: {type: String, required: true},
  vendorAmount: {type: Number, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

receiptSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Receipt', receiptSchema);