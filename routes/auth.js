const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();

const localAuth = passport.authenticate('local', {session: false, failWithError: true});
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

const createAuthToken = user => jwt.sign({ user }, JWT_SECRET, {
  subject: user.username,
  expiresIn: JWT_EXPIRY
});

router.post('/login', localAuth, (req, res) => res.json({authToken: createAuthToken(req.user)}));
router.post('/refresh', jwtAuth, (req, res) => res.json({authToken: createAuthToken(req.user)}));

module.exports = router;

