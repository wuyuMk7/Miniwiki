'use strict'

var mongodb = require('mongodb'),
    genericPool = require('generic-pool'),
    helmet = require('helmet');

var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();

var config = require('./config');
var postsRouter = require('./routes/posts.router.js');

var port = process.env.PORT || 3000;
var env = app.get('env');

var database = (() => {
  var c = config.database[env];
  return {
    host: c.host || 'localhost',
    port: c.port || 27017,
    db: c.db || 'miniwiki',
  };
})();

var pool = genericPool.Pool({
  name: 'mongoPool',
  create: (callback) => {
    mongodb.MongoClient.connect( `mongodb://${database.host}:${database.port}/${database.db}`, {
      server: { poolSize: 1 }
    }, (err, db) => {
      callback(err, db);
    });
  },
  destroy: (db) => { db.close(); },
  max: 10,
  idleTimeoutMillis: 30000,
  log: false
});
app.locals.pool = pool;

//app.enable('trust proxy');
app.set('trust proxy', 'loopback');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: {
    isArray: (value) => { return Array.isArray(value); },
    checkTagLength: (value) => { return value.length <= 5; },
    checkTagContent: (value) => {
      var flag = true;

      //for (var i = 0; i < value.length; ++ i) {
      for (var v of value) {
        //if (value[i].length > 20)
          if (v.length > 20) {
            flag = false;
            break;
          }
      }

      return flag;
    },
  }
}));

app.use((req, res, next) => {
  console.log(`IP:${req.ips} ${req.method} ${req.path}`);
  next();
});
app.use('/v1', postsRouter);

app.listen(port, () => {
  console.log('Server is running...Listening port ' + port);
})
