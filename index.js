const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
const PORT = process.env.PORT || 2000;
const logger = require('turbo-logger').createStream({});
const cors = require('cors');
//Path imports
const migration = require('./db/migration');
const user = require('./routes/api/user')

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// parse application/json
app.use(express.json())

app.use(cors());
app.use(morgan('tiny'));

//Database migration endpoint
app.use('/', migration);
//user endpoint
app.use('/api/', user);


function successResponse() {
  return {
      status: 200,
      message: 'Remi up and running'
  }
}

//Error handlers
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err.status,
  });
});

if (app.get('env') === 'development') {
  app.get('*', (req, res) => {
    res.send(successResponse());
  });
  app.post('*', (req, res) => {
    res.send(successResponse());
  });
}

app.listen(PORT, ()=> {
  if (app.get('env') === 'development') {
    logger.log(`Development Server Started at http://localhost:${PORT}`)
  } else if (app.get('env') === 'production') {
    logger.log('Production Server Started')
  }
});