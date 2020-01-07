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
})

module.exports = router;
