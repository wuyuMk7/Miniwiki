'use strict'

var co = require('co');
var moment = require('moment');
var mongodb = require('mongodb');
var mongoClient = require('mongodb').MongoClient;

var config = require('./../config');

var env = process.env.NODE_ENV || 'development';
var database = (() => {
  var c = config.database[env];
  return {
    host: c.host || 'localhost',
    port: c.port || 27017,
    db: c.db || 'miniwiki',
  };
})();
var url = `mongodb://${database.host}:${database.port}/${database.db}`;

var time = Date.now();
var initialPost = {
  name: 'Introduction',
  url: 'introduction',
  author: 'system',
  tag: ['post', 'intro'],
  content: 'First post',
  visitors: 0,
  up: 0,
  down: 0,
  createdAt: time,
  updatedAt: time,
  lastModified: time,
  metadata: {},
  comment: [
    {
      commenter: 'system',
      email: 'a@a.com',
      createdAt: time,
      content: 'Comment 1',
      reply: [
        {
          commenter: 'system',
          email: 'a@a.com',
          createdAt: time,
          content: 'Comment 2',
        }
      ]
    }
  ],
}

function toThunk(fn) {
  return () => {
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return (cl) => {
      args.push(cl);
      fn.apply(ctx, args);
    }
  }
}

mongoClient.connect(url, (err, client) => {
  if (err) {
    console.log('Fail to connect server.Err: ' + err);
  } else {
    console.log("Connected correctly to server.");
    co(function *() {
      const db = client.db(database.db);
      var postsCollection = db.collection('posts');
      var post = yield postsCollection.find.bind(postsCollection, {'name': 'Introduction'});
      var postCount = yield post.count.bind(post);

      if (postCount === 0) {
        yield postsCollection.insertOne.bind(postsCollection, initialPost);
      }

      yield postsCollection.createIndex.bind(postsCollection, {'name': 1}, {'unique': true});
      yield postsCollection.createIndex.bind(postsCollection, {'url': 1}, {'unique': true});

      client.close();
    }).then(() => {

    }, (err) => {
      console.log(err.stack);
      client.close();
    });
  }
});
