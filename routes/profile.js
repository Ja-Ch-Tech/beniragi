var express = require('express');
var router = express.Router();

/*Activation d'un compte*/
router.get('/activation', function(req, res, next) {
  if (req.session.id_user_beni) {
      res.render('profile/activation', { 
        title: 'Activation compte',
        classWrapper: '',
        classHeader: '',
        footer: '' 
      });
  }else{
      res.redirect("../");
  }
  
});
/* Dashboard candidat */
router.get('/:id/dashboard', function(req, res, next) {
  res.render('profile/dashboard', { 
  	title: 'Votre tabeau de board',
  	classWrapper: '',
  	classHeader: '',
    footer: 'hide' 
  });
});

/*Message*/
router.get('/:id/messages', function(req, res, next) {
  res.render('profile/messages', { 
    title: 'Messages',
    classWrapper: '',
    classHeader: '',
    footer: 'hide' 
  });
});


/*Parametres*/
router.get('/:id/parametres', function(req, res, next) {
  res.render('profile/parametres', { 
    title: 'parametres',
    classWrapper: '',
    classHeader: '',
    footer: 'hide' 
  });
});

/*Feedback*/
router.get('/:id/feedback', function(req, res, next) {
  res.render('profile/feedback', { 
    title: 'feedback',
    classWrapper: '',
    classHeader: '',
    footer: 'hide' 
  });
});

/*Favoris*/
router.get('/:id/favoris', function(req, res, next) {
  res.render('profile/favoris', { 
    title: 'favoris',
    classWrapper: '',
    classHeader: '',
    footer: 'hide' 
  });
});

/*Contacts*/
router.get('/:id/contacts', function(req, res, next) {
  res.render('profile/contacts', { 
    title: 'contacts',
    classWrapper: '',
    classHeader: '',
    footer: 'hide' 
  });
});

module.exports = router;
