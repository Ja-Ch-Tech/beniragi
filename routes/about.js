var express = require('express');
var router = express.Router();

/* Page apropos */
router.get('/', function(req, res, next) {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('about', { 
  	title: 'A propos de nous',
  	classWrapper: '',
  	classHeader: '' 
  });
});
module.exports = router;
