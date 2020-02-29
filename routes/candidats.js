var express = require('express');
var router = express.Router();

/* Affiche les details d'un candidat. */
router.get('/:id/profile', function(req, res, next) {
	
	if (req.params.id == req.session.id_user_beni) {
		res.redirect('/profile/dashboard');
	} else {
		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.render('candidatDetails', { 
			title: 'Profile details',
			classWrapper: '',
			classHeader: '' 
		});
	}
  
});


/* List tous les candidats avec filtre. */
router.get('/liste', function(req, res, next) {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render('candidatsList', { 
  	title: 'Decouvrez nos differents profiles',
  	classWrapper: '',
  	classHeader: '' 
  });
});

module.exports = router;
