var express = require('express');
var router = express.Router();

/*Activation d'un compte*/
router.get('/activation', function(req, res, next) {
  if (req.session.id_user_beni) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.render('profile/activation', { 
        title: 'Activation compte',
        classWrapper: '',
        classHeader: '',
        footer: '' 
      });
  }else{
      res.render('error');
  }
  
});
/* Dashboard candidat */
router.get('/dashboard', function(req, res, next) {
  if (req.session.id_user_beni) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.render('profile/dashboard', { 
        title: 'Votre tableau de bord',
        classWrapper: '',
        classHeader: '',
        isEmployer : req.session.isEmployer,
        footer: 'hide' 
      });
  } else {
    res.render('error');
  }
  
});

/*Message*/
router.get('/messages', function(req, res, next) {
  if (req.session.id_user_beni) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.render('profile/messages', { 
        title: 'Messages',
        classWrapper: '',
        classHeader: '',
        footer: 'hide' 
      });
  } else {
    res.render('error');
  }
  
});


/*Parametres*/
router.get('/parametres', function(req, res, next) {
  if (req.session.id_user_beni) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.render('profile/parametres', { 
        title: 'parametres',
        classWrapper: '',
        classHeader: '',
        footer: 'hide' 
      });
  } else {
    res.render('error');
  }
  
});

/*Feedback*/
router.get('/feedback', function(req, res, next) {
    if (req.session.id_user_beni) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.render('profile/feedback', { 
        title: 'feedback',
        classWrapper: '',
        classHeader: '',
        footer: 'hide' 
      });
    } else {
      res.render('error');
    }
  
});

/*Favoris*/
router.get('/favoris', function(req, res, next) {
  if (req.session.id_user_beni) {
    res.render('profile/favoris', { 
      title: 'favoris',
      classWrapper: '',
      classHeader: '',
      footer: 'hide' 
    });
  } else {
    res.render('error');
  }
  
});

/*Contacts*/
router.get('/contacts', function(req, res, next) {
  if (req.session.id_user_beni) {
    res.render('profile/contacts', { 
      title: 'contacts',
      classWrapper: '',
      classHeader: '',
      footer: 'hide' 
    });
  } else {
    res.render('error');
  }
  
});

/*Booster*/
router.get('/boost', function(req, res, next) {
  if (req.session.id_user_beni) {
    res.render('profile/boostprofile', { 
      title: 'Booster votre compte',
      classWrapper: '',
      classHeader: '',
      footer: 'hide' 
    });
  } else {
    res.render('error');
  }
  
});

module.exports = router;
