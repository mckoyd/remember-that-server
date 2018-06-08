const mongoose = require('mongoose');
const Iou = require('../models/iou');
const { MONGODB_URI } = require('../config');

mongoose.connect(MONGODB_URI)
  .then(() => Iou.find().sort('name')
    .then(results => console.log(results))
    .catch(console.error))
  .then(() => mongoose.disconnect().then(() => console.info('Mongo disconnected')))
  .catch(err => console.err(err));