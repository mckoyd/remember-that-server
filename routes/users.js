const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => 
  User.find()
    .then(results => res.json(results))
    .catch(err => next(err))
);

// Sign up a new user
router.post('/', (req, res, next) => {
  const reqFields = ['username', 'password'];
  const missingField = reqFields.find(field => !(field in req.body));
  if(missingField){
    const err = new Error(`Please include your ${missingField} in the request body`);
    err.status = 422; return next(err);
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName', 'emailAddress'];
  const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field]!=='string');
  if(nonStringField){
    const err = new Error(`'${nonStringField}' must be a String type`);
    err.status = 422; return next(err);
  }

  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => req.body[field].trim()!==req.body[field]);
  if(nonTrimmedField) {
    const err = new Error(`Your ${nonTrimmedField} cannot start or end with a space`);
    err.status = 422; return next(err);
  }

  const sizedFields = {
    username: { min: 4 },
    password: { min: 8, max: 72 }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
  );
  if(tooSmallField){
    const err = new Error(`Your ${tooSmallField} must be at least ${sizedFields[tooSmallField].min} characters long`);
    err.status = 422; return next(err);
  }
  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
  );
  if(tooLargeField){
    const err = new Error(`Your ${tooLargeField} must be at most ${sizedFields[tooLargeField].max} characters long`);
    err.status = 422; return next(err);
  }

  let { username, password, firstName = '', lastName = '', emailAddress = ''} = req.body;
  firstName = firstName.trim(); lastName = lastName.trim(); emailAddress = emailAddress.trim();
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {username, password: digest, firstName, lastName, emailAddress};
      return User.create(newUser);
    })
    .then(result => res.status(201).location(`/api/users/${result.id}`).json(result))
    .catch(err => {
      if(err.code===11000){
        err = new Error('This username already exists.'); err.status = 400;
      }
      next(err);
    });
});

module.exports = router;