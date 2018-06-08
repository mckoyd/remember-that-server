const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Uome = require('../models/uome');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true}));

router.get('/', (req, res, next) => {
  let filter = { userId: req.user.id };
  Uome.find(filter).sort('uomeName')
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
  Uome.findById(id)
    .then(uome => res.json(uome))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const reqFields = ['uomeName', 'uomeAmount'];
  for (let i=0; i<reqFields.length; i++) {
    const field = reqFields[i];
    if (!(field in req.body)) {
      const message = `Missing the \`${field}\` in your request.`;
      return res.status(400).send(message);
    }
  }
  Uome.create({
    uomeName: req.body.uomeName, uomeAmount: req.body.uomeAmount, userId: req.user.id
  })
    .then(uome => res.status(201).json(uome))
    .catch(err => next(err));
});

// router.put('/:id', (res, req, next) => {
//   const upIou = {};

// });

router.delete('/:id', (req, res, next) => {
  Uome.findOneAndRemove({_id: req.params.id})
    .then(() => res.status(204).end())
    .catch(err => next(err));
});




module.exports = router;