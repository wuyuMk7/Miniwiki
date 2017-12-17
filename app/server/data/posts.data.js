'use strict'


/*
 * Model Post
 * TODO: Translate 'post' into ES6 class.
 *
 * Post attribute:
 *   name string
 *   url string
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
 *   metadata object
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

class Post {
  constructor() {
  }

  all() {
    //return new Promise((resolve, reject) => {
    //  pool.acquire((err, db) => {
    //    if (err) {
    //      reject(err);
    //    } else {
    //      //resolve(db.collection('posts').find());
    //      var posts = [];
    //      db.collection('posts').find().each((err, post) => {
    //        if (post != null) {
    //          posts.push(post);
    //        } else {
    //          resolve(posts);
    //        }
    //      })
    //    }
    //  });
    //});
  }
  find() {}
  create() {}
  update() {}
  remove() {}
}

function all(pool) {
  return new Promise((resolve, reject) => {
    pool.acquire().then((db) => {
      //resolve(db.collection('posts').find());
      var posts = [];
      db.collection('posts').find().each((err, post) => {
        if (post != null) {
          posts.push(post);
        } else {
          resolve(posts);
        }
        pool.release(db);
      });
    }).catch((err) => { reject(err); });
  });
}

function find(pool, name) {
  return new Promise((resolve, reject) => {
    var url = encodeURIComponent(decodeURIComponent(name));

    pool.acquire().then((db) => {
      db.collection('posts').findOne({ 'url': { $regex: new RegExp(`^${url}$`, 'i') } }, {}, (err, doc) => {
        resolve(doc);
      });
    }).catch((err) => { reject(err); });
  });
}

function create(pool, post) {
  return new Promise((resolve, reject) => {
    pool.acquire().then((db) => {
      var url = post.name.replace(/\s+/g, '-');
      post.url = encodeURIComponent(url);
      post.down = post.up = post.visitors = 0;
      post.lastModified = post.updatedAt = post.createdAt = Date.now();
      post.comment = [];

      db.collection('posts').findOne({
        $or: [
          { 'name': { $regex: new RegExp(`^${post.name}$`, 'i') } },
          { 'url': { $regex: new RegExp(`^${post.url}$`, 'i') } }
        ]
      }, {}, (err, doc) => {
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
    }).catch((err) => { reject(err); });
  });
}

function update(pool, name, post) {
  return new Promise((resolve, reject) => {
    pool.acquire().then((db) => {
      var timestamp = Date.now();
      var url = encodeURIComponent(decodeURIComponent(name));

      //post.url = encodeURIComponent(post.name.replace(/\s+/g, '-'));
      db.collection('posts').findOne(
        {
          $or: [
            { 'name': { $regex: new RegExp(`^${post.name}$`, 'i') } },
            { 'url': { $regex: new RegExp(`^${post.url}$`, 'i') } }
          ]
        }, {},
        (err, doc) => {
          if (err) {
            reject(err);
          } else {
            if (doc != null && doc.url != url) {
              resolve({ validation: false, error: [{ param: 'name', msg: 'name or url exists' }] });
            } else {
              db.collection('posts').updateOne(
                { 'url': url },
                {
                  $set: {
                    name: post.name,
                    url: post.url,
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
                        { 'url': url },
                        { $set: { updatedAt: timestamp, lastModified: timestamp } },
                        (err, rres) => { err ? reject(err) : resolve(rres); }
                      )
                    } else {
                      db.collection('posts').updateOne(
                        { 'url': url },
                        { $set: { updatedAt: timestamp } },
                        (err, rres) => { err ? reject(err) : resolve(rres); }
                      )
                    }
                  }
                }
              );
            }
          }
        }
      );
    })
  })
}

/**
 * update_old
 * Deprecated
 */
function update_old(pool, name, post) {
  return new Promise((resolve, reject) => {
    pool.acquire((err, db) => {
      if (err) {
        reject(err);
      } else {
        var timestamp = Date.now();
        var url = encodeURIComponent(decodeURIComponent(name));

        //post.url = encodeURIComponent(post.name.replace(/\s+/g, '-'));
        db.collection('posts').findOneAndUpdate(
          { 'url': url },
          {
            $set: {
              name: post.name,
              url: post.url,
              author: post.author,
              content: post.content,
              tag: post.tag,
            },
          },
          (err, res) => {
            if (err) {
              reject(err);
              //console.log(err);
            } else {
              if (res.result != undefined && res.result.ok == 1 && res.result.nModified > 0) {
                db.collection('posts').updateOne(
                  { 'url': url },
                  { $set: { updatedAt: timestamp, lastModified: timestamp } },
                  (err, rres) => { err ? reject(err) : resolve(rres); }
                )
              } else {
                db.collection('posts').updateOne(
                  { 'url': url },
                  { $set: { updatedAt: timestamp } },
                  (err, rres) => { err ? reject(err) : resolve(rres); }
                )
              }
            }
          }
        );
        //db.collection('posts').findOne({ 'url': { $regex: new RegExp(`^${url}$`, 'i') } },{}, (err, doc) => {
        //  if (err) {
        //    reject(err);
        //  } else {
        //    if (doc != null) {
        //      if (doc.name == post.name && doc.url == post.url) {
        //        db.collection('posts').updateOne(
        //          { 'url': url },
        //          {
        //            $set: {
        //              author: post.author,
        //              content: post.content,
        //              tag: post.tag,
        //            },
        //          },
        //          (err, res) => {
        //            if (err) {
        //              reject(err);
        //            } else {
        //              if (res.result != undefined && res.result.ok == 1 && res.result.nModified > 0) {
        //                db.collection('posts').updateOne(
        //                  { 'url': url },
        //                  { $set: { updatedAt: timestamp, lastModified: timestamp } },
        //                  (err, rres) => { err ? reject(err) : resolve(rres); }
        //                )
        //              } else {
        //                db.collection('posts').updateOne(
        //                  { 'url': url },
        //                  { $set: { updatedAt: timestamp } },
        //                  (err, rres) => { err ? reject(err) : resolve(rres); }
        //                )
        //              }
        //            }
        //          }
        //        );
        //      } else {

        //      }
        //    } else {
        //      reject("Wrong post url");
        //    }
        //  }
        //});
      }
    })
  })
}

function remove(pool, name) {
  return new Promise((resolve, reject) => {
    pool.acquire().then((err, db) => {
      var url = encodeURIComponent(decodeURIComponent(name));

      db.collection('posts').deleteOne({ 'url': { $regex: new RegExp(`^${url}$`, 'i') } }, (err, res) => {
        resolve(res);
      })
    }).catch((err) => { reject(err); });
  });
}

module.exports.all = all;
module.exports.find = find;
module.exports.create = create;
module.exports.remove = remove;
module.exports.update = update;
