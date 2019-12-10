var express = require('express');
var router = express.Router();

/* Affiche les details d'un candidat. */
router.get('/:id/profile', function(req, res, next) {
  res.render('candidatDetails', { 
  	title: 'Profile details',
  	classWrapper: '',
  	classHeader: '' 
  });
});


/* List tous les candidats avec filtre. */
router.get('/liste', function(req, res, next) {
  res.render('candidatsList', { 
  	title: 'Decouvrez nos differents profiles',
  	classWrapper: '',
  	classHeader: '' 
  });
});

module.exports = router;
