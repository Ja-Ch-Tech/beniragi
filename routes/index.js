var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Biensure sur Beniragi',
  	classWrapper: 'wrapper-with-transparent-header',
  	classHeader: 'transparent-header' ,
  	user_session : req.session.id_user_beni
  });
});

router.get("/logout", (req, res) => {

    if (req.session.id_user_beni) {
        delete req.session.id_user_beni;
        delete req.session.id_type_user_beni;
        delete req.session.isEmployer;

    } else {
        res.redirect("/");
    }

    res.redirect("/");
});

/* Recuperation du mot de passe */
router.get('/recuperation/mdp', function(req, res, next) {
  res.render('recuperation_mdp', { 
    title: 'Recuperation mot de passe',
    classWrapper: '',
    classHeader: ''
  });
});

/* Formulaire de modification du mot de passe */
router.get('/activation', function(req, res, next) {
  res.render('change_mdp', { 
    title: 'Nouveau mot de passe',
    classWrapper: '',
    classHeader: ''
  });
});

/* Contrat beniragi */
router.get('/contrat', function(req, res, next) {
  res.render('contrat', { 
    title: 'Termes et contrat beniragi',
    classWrapper: '',
    classHeader: ''
  });
});

module.exports = router;
