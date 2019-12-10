var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Biensure sur beniragi',
  	classWrapper: 'wrapper-with-transparent-header',
  	classHeader: 'transparent-header' 
  });
});

module.exports = router;
