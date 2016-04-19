'use strict'

/*
 * Model Post
 * TODO: Translate 'post' into ES6 class.
 *
 * Post attribute:
 *   name string
 *   author string
 *   tag array
 *   content string
 *   visitors int
 *   up int
 *   down int
 *   createdAt timestamp
 *   updatedAt timestamp
 *   lastModified timestamp
 *   comment array
 *
 * 1st level comment attribute:
 *   commenter string
 *   email string
 *   createdAt timestamp
 *   content string
 *   reply array
 *
 * 2nd level comment (reply) attribute:
 *   commenter string
 *   email string
 *   createdAt timestamp
 *   content string
 */

function all(pool) {
  return new Promise((resolve, reject) => {
    pool.acquire((err, db) => {
      if (err) {
        reject(err);
      } else {
        //resolve(db.collection('posts').find());
        var posts = [];
        db.collection('posts').find().each((err, post) => {
          if (post != null) {
            posts.push(post);
          } else {
            resolve(posts);
          }
        })
      }
    });
  });
}

function find(pool, name) {
  return new Promise((resolve, reject) => {
    pool.acquire((err, db) => {
      if (err) {
        reject(err);
      } else {
        db.collection('posts').findOne({ 'name': { $regex: new RegExp(`^${name}$`, 'i') } }, {}, (err, doc) => {
          resolve(doc);
        });
      }
    });
  });
}

function create(pool, post) {
  return new Promise((resolve, reject) => {
    pool.acquire((err, db) => {
      if (err) {
        reject(err);
      } else {
        post.down = post.up = post.visitors = 0;
        post.lastModified = post.updatedAt = post.createdAt = Date.now();
        post.comment = [];

        db.collection('posts').findOne({ 'name': { $regex: new RegExp(`^${post.name}$`, 'i') } }, {}, (err, doc) => {
          if (err) {
            reject(err);
          } else {
            if (doc != null) {
              resolve({ validation: false, error: [{ param: 'name', msg: 'name exists' }] });
            } else {
              db.collection('posts').insertOne(post, (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            }
          }
        });
      }
    });
  });
}

function update(pool, name, post) {
  return new Promise((resolve, reject) => {
    pool.acquire((err, db) => {
      if (err) {
        reject(err);
      } else {
        var timestamp = Date.now();

        db.collection('posts').updateOne(
          { 'name': name },
          {
            $set: {
              name: post.name,
              author: post.author,
              content: post.content,
              tag: post.tag,
            },
          },
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              if (res.result != undefined && res.result.ok == 1 && res.result.nModified > 0) {
                db.collection('posts').updateOne(
                  { 'name': name },
                  { $set: { updatedAt: timestamp, lastModified: timestamp } },
                  (err, rres) => { err ? reject(err) : resolve(rres); }
                )
              } else {
                db.collection('posts').updateOne(
                  { 'name': name },
                  { $set: { updatedAt: timestamp } },
                  (err, rres) => { err ? reject(err) : resolve(rres); }
                )
              }
            }
          }
        );
      }
    })
  })
}

function remove(pool, name) {
  return new Promise((resolve, reject) => {
    pool.acquire((err, db) => {
      if (err) {
        reject(err);
      } else {
        db.collection('posts').deleteOne({ 'name': { $regex: new RegExp(`^${name}$`, 'i') } }, (err, res) => {
          resolve(res);
        })
      }
    });
  });
}

module.exports.all = all;
module.exports.find = find;
module.exports.create = create;
module.exports.remove = remove;
module.exports.update = update;
