'use strict'

var router = require('express').Router();
var posts = require('./../data/posts.data');
var validatorPost = require('./../lib/validator.lib').validatorPost;

router.use((req, res, next) => {
  next();
});

router.get('/posts', (req, res, next) => {
  posts.all(req.app.locals.pool).then((data) => {
    res.json({ data: data });
  }, (err) => {
    res.sendStatus(500);
    console.log(err);
  });
});

router.route('/post/:name')
//.all((req, res, next) => { next(); })
.get((req, res, next) => {
  //req.sanitizeParams('name').escape();
  var name = req.params.name;
  console.log(name);
  posts.find(req.app.locals.pool, name).then((data) => {
    res.json({ data: data });
  }, (err) => {
    res.sendStatus(500);
    console.log(err);
  });
})
.put(validatorPost, (req, res, next) => {
  var name = req.params.name;
  var post = req.body;
  posts.update(req.app.locals.pool, name, post).then((data) => {
    if (data.result != undefined && data.result.ok == 1) {
      res.json({ data: { status: 'ok' } });
    } else {
      if (data.validation != undefined && data.validation == false) {
        res.json({ data: data });
      } else {
        res.sendStatus(500);
        console.log(data);
      }
    }
  }, (err) => {
    res.sendStatus(500);
    console.log(err);
  });
})
.delete((req, res, next) => {
  var name = req.params.name;
  posts.remove(req.app.locals.pool, name).then((data) => {
    //res.json({ data: data });
    if (data.result != undefined && data.result.ok == 1 && data.result.n > 0) {
      res.json({ data: { status: 'ok' } });
    } else {
      res.json({ data: { status: 'fail' } });
    }
  }, (err) => {
    res.sendStatus(500);
    console.log(err);
  })
});

router.route('/post/new')
.post(validatorPost, (req, res, next) => {
  var post = req.body;
  posts.create(req.app.locals.pool, post).then((data) => {
    if (data.result != undefined && data.result.ok == 1 && data.result.n > 0) {
      res.json({ data: { status: 'ok' } });
    } else {
      if (data.validation != undefined && data.validation == false) {
        res.json({ data: data });
      } else {
        res.sendStatus(500);
        console.log(data);
      }
    }
  }, (err) => {
    res.sendStatus(500);
    console.log(err);
  })
});

router.route('/comment/:postName')
.get((req, res, next) => {

});

router.route('/comment/:postName/new')
.post((req, res, next) => {

});

router.route('/comment/:postName/:id')
.delete((req, res, next) => {

});


module.exports = router;
