const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Receipt = require('../models/receipt');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

router.get('/', (req, res, next) => {
  let filter = { userId: req.user.id }; 
  Receipt.find(filter).sort('vendorName')
    .then(results => res.json(results))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`${id} is not a valid Id!`);
    err.status = 400;
    return next(err);
  }
  Receipt.findById(id)
    .then(receipt => res.json(receipt))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const reqFields = ['vendorName', 'vendorAmount'];
  for (let i=0; i<reqFields.length; i++) {
    const field = reqFields[i];
    if (!(field in req.body)) {
      const message = `Missing the \`${field}\` in your request.`;
      return res.status(400).send(message);
    }
  }
  Receipt.create({
    vendorName: req.body.vendorName, vendorAmount: req.body.vendorAmount, userId: req.user.id
  })
    .then(vendor => res.status(201).json(vendor))
    .catch(err => next(err));
});

// router.put('/:id', (res, req, next) => {
//   const upvendor = {};

// });

router.delete('/:id', (req, res, next) => {
  Receipt.findOneAndRemove({_id: req.params.id})
    .then(() => res.status(204).end())
    .catch(err => next(err));
});




module.exports = router;