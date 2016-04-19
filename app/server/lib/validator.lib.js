'use strict'

var validatorPost = function (req, res, next) {
  req.checkBody('name')
    .notEmpty().withMessage('Cannot be empty');
  req.checkBody('author')
    .notEmpty().withMessage('Cannot be empty');
  req.checkBody('content')
    .notEmpty().withMessage('Cannot be empty');
  req.checkBody('tag')
    .optional()
    .isArray().withMessage('Invalid tags')
    .checkTagContent().withMessage('0-20 chars');

  var errors = req.validationErrors();
  if (errors) {
    res.json({
      data: {
        validation: false,
        error: errors
      }
    });
  } else {
    next();
  }
}

var validatorComment = function (req, res, next) {
  req.checkBody('commenter')
    .notEmpty().withMessage('cannot be empty');
  next();
}

module.exports = {
  validatorPost: validatorPost,
}
