var express = require('express');
var router = express.Router();
var axios = require("axios").default;
var API = require("../manageURL").URL().API;

var session = require("cookie-session");

var app = express();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//Creation d'un compte
router.post('/register', (req, res) => {

    if ((req.body.email && req.body.email.trim(" ")) ||
        (req.body.password && req.body.password.trim(" ")) ||
        (req.body.id_type && req.body.id_type.trim(" "))) {
        var data = {
            email: req.body.email,
            password: req.body.password,
            id_type: req.body.id_type
        }

        axios.post(`${API}/users/register`, data)
            .then(datas => {

                if (datas.data.getEtat) {

                    req.session.id_user_beni = datas.getObjet._id;
                    req.session.id_type_user_beni = datas.getObjet.id_type;

                    res.status(200);
                    res.send(datas.data);

                } else {

                    res.status(200);
                    res.send(datas.data)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({
            getEtat: false,
            getMessage: "Certains champs obligatoires sont vides"
        })
    }
})

//Connexion d'un compte
router.post('/login', (req, res) => {
    if ((req.body.email && req.body.email.trim(" ")) || (req.body.password && req.body.password.trim(" "))) {
        var data = {
            email: req.body.email,
            password: req.body.password
        }

        axios.post(`${API}/users/login`, data)
            .then(datas => {
                if (datas.getEtat) {
                    req.session.id_user_beni = datas.getObjet.id_user;
                    req.session.id_type_user_beni = datas.getObjet.id_type;
                    req.session.type_user_beni = datas.getObjet.typeUser;
                    
                    res.status(200);
                    res.send(datas);

                } else {

                    res.status(500);
                    res.send(datas)
                }
            })
            .catch(error => {
                res.send(error)
            })
    } else {
        res.send({ getEtat: false, getMessage: "Veuillez remplir tous les champs" })
    }
})

router.get('/getAllTypeUsers', (req,  res) => {
    axios.get(`${API}/type_users/getAll`)
         .then(response => {
             res.status(200).send(response.data);
         })
         .catch(err => {
             res.status(500).send(err);
         })
})

module.exports = router;
