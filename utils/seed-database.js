const mongoose = require('mongoose');
const {MONGODB_URI} = require('../config');
const Iou = require('../models/iou');
const Uome = require('../models/uome');
const Receipt = require('../models/receipt');
const User = require('../models/user');

const seedIous = require('../db/seed/ious');
const seedUomes = require('../db/seed/uomes');
const seedReceipts = require('../db/seed/receipts');
const seedUsers = require('../db/seed/users');

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => Promise.all(seedUsers.map(user => User.hashPassword(user.password))))
  .then(digests => {
    seedUsers.forEach((user, i) => user.password = digests[i]);
    return Promise.all([
      User.insertMany(seedUsers),
      Iou.insertMany(seedIous),
      Uome.insertMany(seedUomes),
      Receipt.insertMany(seedReceipts),
    ]);
  })
  .then(results => console.info(`Inserted ${results.length} Users and it's working beautifully. Next thing...`))
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.log(`ERROR: ${err.message}`);
    console.error(err);
  });