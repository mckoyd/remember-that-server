const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', { session: false });

const createAuthToken = user => jwt.sign({ user }, JWT_SECRET, {
  subject: user.username,
  expiresIn: JWT_EXPIRY,
  algorithm: 'HS256'
});

router.post('/login', localAuth, (req, res) => res.json({authToken: createAuthToken(req.user)}));
router.post('/refresh', jwtAuth, (req, res) => res.json({authToken: createAuthToken(req.user)}));

module.exports = router;

