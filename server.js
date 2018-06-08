require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const app = express();

const {PORT, MONGODB_URI, CLIENT_ORIGIN} = require('./config');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const iousRouter = require('./routes/ious');
const uomesRouter = require('./routes/uomes');
const receiptsRouter = require('./routes/receipts');

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

app.use(cors({origin: CLIENT_ORIGIN}));

app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/ious', iousRouter);
app.use('/api/uomes', uomesRouter);
app.use('/api/receipts', receiptsRouter);

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

// Listen for incoming connections
if (require.main === module) {
  mongoose.connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n Start the mongo database first... \n');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;