var express = require('express');
var router = express.Router();

/* Page apropos */
router.get('/', function(req, res, next) {
  res.render('about', { 
  	title: 'A propos de nous',
  	classWrapper: '',
  	classHeader: '' 
  });
});
module.exports = router;
