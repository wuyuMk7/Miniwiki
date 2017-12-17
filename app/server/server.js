'use strict'

var fs = require('fs'),
    mongodb = require('mongodb'),
    genericPool = require('generic-pool'),
    helmet = require('helmet');

var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();

var assert = require('assert');

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
/**
 * There probably exists some problems.
 * I resolve object db to the others in create method.
 * I will close db in the destroy methond.
 * In fact, I think I should close client object here.
 * I will modify it in some time.
 * TODO: Modify db back to client.
 */
var pool = genericPool.createPool({
  name: 'mongoPool',
  create: (callback) => {
    return new Promise((resolve, reject) => {
      mongodb.MongoClient.connect( `mongodb://${database.host}:${database.port}/${database.db}`, {
        server: { poolSize: 1 }
      }, (err, client) => {
        if (err) {
          reject(err);
        } else {
          resolve(client);
          console.log("Mongodb connected.");
        }
      })
    });
  },
  destroy: (client) => { client.close(); },
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

/**
 * Register custom routers
 */
app.use('/v1', postsRouter);
/**
 * Config static file path
 *
 * If you don't use express to serve static file,
 * change the option 'confit.server.staticFile' in the 'config.js' to false.
 */
if (config.server.staticFile) {
  var path = config.server.staticPath;
  if (path === undefined || !fs.existsSync(path)) path = __dirname + "/../../public";
  app.use(express.static(path));
  app.use('*', (req, res) => { res.sendFile('index.html', { root: path }) });
}

app.listen(port, () => {
  console.log('Server is running...Listening port ' + port);
})
